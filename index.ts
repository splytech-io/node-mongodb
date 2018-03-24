import * as mongodb from 'mongodb';

export namespace MongoDB {
  export type Collection<T = any> = mongodb.Collection<T>;
  export type UpdateWriteOpResult = mongodb.UpdateWriteOpResult;

  interface CollectionIndex {
    collection: Collection;
    index: Index;
  }

  export interface Index {
    spec: { [key: string]: -1 | 1 };
    options?: mongodb.IndexOptions;
  }

  export interface CollectionOptions {
    collectionName: string;
    collectionOptions?: mongodb.DbCollectionOptions;
    indexes?: Index[];
  }

  /**
   *
   */
  export class Connection {
    private client?: mongodb.MongoClient;
    private db?: mongodb.Db;
    private collections: { [key: string]: Collection } = {};
    private indexes: CollectionIndex[] = [];

    /**
     * Connects to the mongodb and creates indexes
     *
     * @param {string} url
     * @param {mongodb.MongoClientOptions} options
     * @returns {Promise<void>}
     */
    async open(url: string, options?: mongodb.MongoClientOptions): Promise<void> {
      if (this.client) {
        throw new Error('Already connected');
      }

      await mongodb.MongoClient.connect(url, Object.assign({
        autoReconnect: true,
        reconnectTries: Infinity,
        connectTimeoutMS: 5000,
        native_parser: true,
        ignoreUndefined: true,
        validateOptions: true,
      }, options)).then((mongoClient: mongodb.MongoClient) => {
        this.client = mongoClient;
        this.db = mongoClient.db();
      });

      await Promise.all(this.indexes.map(async (item: CollectionIndex) => {
        return item.collection.createIndex(item.index.spec, item.index.options);
      }));
    }

    /**
     * Disconnects from mongodb
     *
     * @returns {Promise<void>}
     */
    async close() {
      if (!this.client) {
        throw new Error('Not connected');
      }

      await this.client.close();

      this.client = undefined;
      this.db = undefined;
      this.collections = {};
    }

    /**
     *
     * @param {CollectionOptions} options
     * @returns {Collection<T>}
     */
    createCollection<T>(options: CollectionOptions): Collection<T> {
      const { collectionName, collectionOptions } = options;

      const proxy: any = new Proxy({}, {

        /**
         *
         * @param {{}} _
         * @param {PropertyKey} name
         * @returns {boolean}
         */
        has: (_, name) => {
          return !!(<any>this.getCollection(collectionName, collectionOptions))[name];
        },

        /**
         *
         * @param {{}} _
         * @param {PropertyKey} key
         * @param {PropertyDescriptor} descriptor
         * @returns {any}
         */
        defineProperty: (_, key, descriptor) => {
          // invariant(key, 'define');
          // console.log('defineProperty', key, descriptor);

          return Object.defineProperty(this.getCollection(collectionName, collectionOptions), key, descriptor);
        },

        /**
         *
         * @param {{}} _
         * @param {PropertyKey} prop
         * @returns {{configurable: boolean; enumerable: boolean; value: any}}
         */
        getOwnPropertyDescriptor: (_, prop) => {
          const collection = this.getCollection(collectionName, collectionOptions);
          // console.log(collection);
          // console.log('getOwnPropertyDescriptor', Object.getOwnPropertyDescriptor(
          //   collection,
          //   prop,
          // ));

          return {
            configurable: true,
            enumerable: true,
            value: (<any>collection)[prop],
          };
        },

        /**
         *
         * @param {{}} _
         * @param {PropertyKey} name
         * @param value
         * @returns {boolean}
         */
        set: (_, name, value) => {
          (<any>this.getCollection(collectionName, collectionOptions))[name] = value;

          return true;
        },

        /**
         *
         * @param {{}} _
         * @param {PropertyKey} name
         * @returns {any}
         */
        get: (_, name) => {
          if (!this.db) {
            return async () => Promise.reject(new Error('not connected'));
          }

          return (<any>this.getCollection(collectionName, collectionOptions))[name];
        },
      });

      if (options.indexes) {
        options.indexes.forEach((index) => {
          this.indexes.push({
            collection: proxy,
            index: index,
          });
        });
      }

      return proxy;
    }

    /**
     *
     * @param {string} name
     * @param {mongodb.DbCollectionOptions} options
     * @returns {Collection}
     */
    private getCollection(name: string, options?: mongodb.DbCollectionOptions): Collection {
      if (!this.db) {
        throw new Error('not connected');
      }


      if (!this.collections[name]) {
        this.collections[name] = (<any>this.db.collection)(name, options);
      }

      return this.collections[name];
    }
  }

  /**
   * Default connection
   *
   * @type {MongoDB.Connection}
   */
  export const connection = new Connection();

}
