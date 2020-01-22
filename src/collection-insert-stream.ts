import { FilterQuery } from 'mongodb';
import { MongoDB } from './index';
import { ReadPreference, Timestamp } from './mongodb';
import { matchesFilter, throttle } from './utils';

interface Cursor {
  _data: string;
}

interface InsertStreamItem<T> {
  _id: Cursor;
  operationType: 'insert';
  clusterTime: Timestamp;
  ns: { db: string; coll: string };
  documentKey: {
    _id: MongoDB.ObjectID;
  };
  fullDocument: T;
}

export interface Subscription {
  unsubscribe: () => void;
}

interface SubscriptionParameters<T> {
  filter: (doc: T) => boolean;
  callback: (doc: T) => void;
}

export class CollectionInsertStream<T extends { _id: MongoDB.ObjectID }> {
  private cursor?: Cursor;
  private status: 'started' | 'stopped' = 'stopped';
  private readonly subscriptions: Map<Function, SubscriptionParameters<T>> = new Map();
  private watcher?: MongoDB.ChangeStream;

  constructor(
    private readonly collection: MongoDB.Collection<T>,
  ) {

  }

  /**
   *
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    if (this.status === 'started') {
      return;
    }

    this.status = 'started';
    this.initStream();
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async stop(): Promise<void> {
    if (this.status === 'stopped') {
      return;
    }

    this.status = 'stopped';
    this.subscriptions.clear();
    this.watcher?.close();
  }

  /**
   *
   * @param {SubscriptionParameters<T>} params
   * @returns {Subscription}
   */
  subscribe(params: SubscriptionParameters<T>): Subscription {
    this.subscriptions.set(params.callback, params);

    return {
      unsubscribe: () => {
        this.subscriptions.delete(params.callback);
      },
    };
  }

  /**
   *
   * @param {ObjectMap<any>} filter
   * @param {(doc: T) => Promise<void>} callback
   * @returns {{stop: () => void}}
   */
  async findAndTail(
    filter: FilterQuery<T>,
    callback: (doc: T) => Promise<void> | void,
  ): Promise<{ stop: () => void }> {
    const stack: Array<T> = [];
    let readyToSend = false;

    const subscription = this.subscribe({
      filter: matchesFilter(filter),
      callback: (item) => {
        stack.push(item);
        flushStack();
      },
    });

    const flushStack = throttle(async () => {
      if (!readyToSend || stack.length === 0) {
        return;
      }

      await Promise.resolve(callback(stack.shift() as T)).catch((e) => {
        console.error(e);
        subscription.unsubscribe();
      });
      setImmediate(flushStack);
    });

    await this.collection.find(filter).toArray().then((records) => {
      // - remove duplicates
      records.forEach((item1) => {
        if (stack.every((item2) => !item2._id.equals(item1._id))) {
          stack.push(item1);
        }
      });
      // - put all messages in the order
      stack.sort(({ _id: a }, { _id: b }) => {
        return a.getTimestamp().getTime() - b.getTimestamp().getTime();
      });

      readyToSend = true;
      flushStack();
    });

    return {
      stop: () => {
        readyToSend = false;
        subscription.unsubscribe();
      },
    };
  }

  /**
   *
   * @param {InsertStreamItem<T>} item
   */
  private deliver(item: InsertStreamItem<T>): void {
    this.cursor = item._id;

    for (const subscription of this.subscriptions.values()) {
      if (!subscription.filter(item.fullDocument)) {
        continue;
      }

      subscription.callback(item.fullDocument);
    }
  }

  /**
   *
   */
  private initStream(): void {
    const readPreference = new ReadPreference(ReadPreference.SECONDARY_PREFERRED, []);

    this.watcher = this.collection.watch([{
      $match: { 'operationType': 'insert' },
    }], {
      readPreference,
      resumeAfter: this.cursor,
    });

    this.watcher.on('change', (data: InsertStreamItem<T>) => this.deliver(data));
    this.watcher.on('error', console.error.bind(console, this.constructor.name));
    this.watcher.on('close', () => {
      if (this.status === 'started') {
        setTimeout(() => this.initStream(), 500);
      }
    });
  }
}
