import { MongoDB } from './index';
import { Collection } from './mongodb';

interface WatchResult<T> {
  _id: {
    _data: string;
  };
  operationType: 'insert' | 'update' | 'replace' | 'delete';
  fullDocument: T;
  // clusterTime: Timestamp;
  ns: { db: string; coll: string };
  documentKey: { _id: MongoDB.ObjectID };
}

type CallbackParams<T> = {
  _id: MongoDB.ObjectID;
  operationType: 'insert' | 'update' | 'replace';
  fullDocument: T;
} | {
  _id: MongoDB.ObjectID;
  operationType: 'delete';
};

export class CollectionWatcher<T> {
  constructor(
    private readonly collection: Collection<T>,
    private readonly cb: (params: CallbackParams<T>) => void,
  ) {

  }

  start() {
    let resumeToken: object | undefined;
    let cursorInstance = init(this);
    let stopped = false;

    return {
      stop: () => {
        stopped = true;
        cursorInstance.close().catch(() => null);
      },
    };

    function init(that: CollectionWatcher<T>) {
      const cursor = that.collection.watch([], {
        fullDocument: 'updateLookup',
        resumeAfter: resumeToken,
      });

      const next = () => {
        cursor.next().then((r: WatchResult<any>) => {
          switch (r.operationType) {
            case 'delete':
              that.cb({
                operationType: r.operationType,
                _id: r.documentKey._id,
              });
              break;
            case 'insert':
            case 'replace':
            case 'update':
              that.cb({
                operationType: r.operationType,
                _id: r.documentKey._id,
                fullDocument: r.fullDocument,
              });
              break;
          }

          resumeToken = r._id;

          next();
        }, () => {
          if (stopped) {
            return;
          }

          setTimeout(() => {
            cursor.close().catch(() => null);
            cursorInstance = init(that);
          }, 1000);
        });
      };

      next();

      return cursor;
    }
  }

}
