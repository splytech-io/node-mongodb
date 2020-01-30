import { Utils } from '@splytech-io/utils';
import { Cursor, FilterQuery } from 'mongodb';
import { MongoDB } from './index';
import { ReadPreference, Timestamp } from './mongodb';
import { matchesFilter, throttle } from './utils';


interface SubscriptionParameters<T> {
  filter: (doc: T) => boolean;
  callback: (doc: T) => void;
}

export class CollectionWatchStream<T extends { _id: MongoDB.ObjectID }> {
  private cursor?: CollectionWatchStream.ResumeToken;
  private status: 'started' | 'stopped' = 'stopped';
  private readonly subscriptions: Map<Function, SubscriptionParameters<T>> = new Map();
  private stream?: Cursor;

  constructor(
    private readonly collection: MongoDB.Collection<T>,
    private readonly options: CollectionWatchStream.Options = {},
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
    this.stream?.close();
  }

  /**
   *
   * @param {SubscriptionParameters<T>} params
   * @returns {Subscription}
   */
  subscribe(params: SubscriptionParameters<T>): CollectionWatchStream.Subscription {
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
  ): Promise<{ stop: () => void; info: { initialLoad: number; duplicates: number } }> {
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

    const info = await this.collection.find(filter).toArray().then((records) => {
      const result = {
        duplicates: 0,
        initialLoad: 0,
      };

      // - remove duplicates
      records.forEach((item1) => {
        result.initialLoad++;
        if (stack.every((item2) => !item2._id.equals(item1._id))) {
          stack.push(item1);
        } else {
          result.duplicates++;
        }
      });
      // - put all messages in the order
      stack.sort(({ _id: a }, { _id: b }) => {
        return a.getTimestamp().getTime() - b.getTimestamp().getTime();
      });

      readyToSend = true;
      flushStack();

      return result;
    });

    return {
      info,
      stop: () => {
        readyToSend = false;
        subscription.unsubscribe();
      },
    };
  }

  /**
   *
   * @param {WatchStreamItem<T>} item
   */
  private deliver(item: CollectionWatchStream.WatchStreamItem<T>): void {
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
    const pipeline = [];

    if (this.options.operationType) {
      if (this.options.operationType instanceof Array) {
        pipeline.push({
          $match: { 'operationType': { $in: this.options.operationType } },
        });
      } else {
        pipeline.push({
          $match: { 'operationType': this.options.operationType },
        });
      }
    }

    this.stream = this.collection.watch(pipeline, {
      readPreference: this.options.readPreference,
      resumeAfter: this.cursor,
      fullDocument: 'updateLookup',
    }).stream();

    if (this.options.readPreference) {
      this.stream.setReadPreference(this.options.readPreference);
    }

    this.stream.pipe(Utils.callbackStream<CollectionWatchStream.WatchStreamItem<T>>((item) => {
      this.cursor = item._id;

      return this.deliver(item);
    }));
    this.stream.on('error', () => null);
    this.stream.on('close', () => {
      if (this.status === 'started') {
        setTimeout(() => this.initStream(), 500);
      }
    });
  }
}

export namespace CollectionWatchStream {
  export type OperationType = 'insert' | 'update';

  export interface Options {
    readPreference?: ReadPreference;
    operationType?: OperationType | Array<OperationType>;
  }

  export interface ResumeToken {
    _data: string;
  }

  export interface WatchStreamItem<T> {
    _id: ResumeToken;
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
}
