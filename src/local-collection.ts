import { Collection } from 'mongodb';
import { CollectionWatcher } from './collection-watcher';
import { DocumentMap } from './interfaces';

export class LocalCollection<T> {
  private readonly collectionWatcher: CollectionWatcher<T>;

  constructor(
    private readonly collection: Collection<any>,
    private readonly storage: DocumentMap<T>,
  ) {
    this.collectionWatcher = new CollectionWatcher<any>(collection, (params) => {
      switch (params.operationType) {
        case 'insert':
        case 'update':
        case 'replace':
          storage.set(params._id.toHexString(), params.fullDocument);
          break;
        case 'delete':
          storage.delete(params._id.toHexString());
          break;
      }
    });
  }

  /**
   *
   */
  start() {
    const stopCollectionWatcher = this.collectionWatcher.start().stop;

    this.collection.find<any>().toArray().then((r) => {
      r.forEach((item) => {
        if (!this.storage.has(item._id.toHexString())) {
          this.storage.set(item._id.toHexString(), item);
        }
      });
    }).catch(() => null);

    return {
      stop() {
        stopCollectionWatcher();
      },
    };
  }

}
