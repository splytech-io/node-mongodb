import { EventEmitter } from 'events';
import { Collection } from 'mongodb';
import { CollectionWatcher } from './collection-watcher';
import { DocumentMap } from './interfaces';

export class LocalCollection<T, U> extends EventEmitter {
  private readonly collectionWatcher: CollectionWatcher<T>;

  constructor(
    private readonly collection: Collection<any>,
    public readonly storage: DocumentMap<T> & U,
  ) {
    super();

    this.collectionWatcher = new CollectionWatcher<any>(collection, (params) => {
      switch (params.operationType) {
        case 'insert':
        case 'update':
        case 'replace':
          this.storage.set(`${ params._id }`, params.fullDocument);
          this.emit('change');
          this.emit('upsert', params.fullDocument);
          break;
        case 'delete':
          this.storage.delete(`${ params._id }`);
          this.emit('change');
          this.emit('delete', params._id);
          break;
      }
    });
  }

  /**
   *
   */
  async start() {
    const stopCollectionWatcher = this.collectionWatcher.start().stop;

    await this.pull();

    this.emit('ready');

    return {
      stop() {
        stopCollectionWatcher();
      },
    };
  }

  async pull() {
    return this.collection.find<any>().toArray().then((r) => {
      r.forEach((item) => {
        if (!this.storage.has(`${ item._id }`)) {
          this.storage.set(`${ item._id }`, item);
        }
      });
    });
  }

}
