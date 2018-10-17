import { ObjectID as MongoDBObjectID } from 'mongodb';
import * as mongodb from 'mongodb';

export namespace MongoDB {
  export type UpdateWriteOpResult = mongodb.UpdateWriteOpResult;
  export type ReplaceOneOptions = mongodb.ReplaceOneOptions;
  export type InsertOneWriteOpResult = mongodb.InsertOneWriteOpResult;
  export type CollectionInsertOneOptions = mongodb.CollectionInsertOneOptions;
  export type InsertWriteOpResult = mongodb.InsertWriteOpResult;
  export type FindOneOptions = mongodb.FindOneOptions;
  export type FindOperatorsUnordered = mongodb.FindOperatorsUnordered;
  export type UnorderedBulkOperation = mongodb.UnorderedBulkOperation;
  export type FindOperatorsOrdered = mongodb.FindOperatorsOrdered;
  export type BulkWriteResult = mongodb.BulkWriteResult;
  export const MongoError = mongodb.MongoError;

  export namespace Code {
    /* tslint:disable no-unused-variables */
    export const OK = 0;
    export const INTERNAL_ERROR = 1;
    export const BAD_VALUE = 2;
    export const OBSOLETE_DUPLICATE_KEY = 3;
    export const NO_SUCH_KEY = 4;
    export const GRAPH_CONTAINS_CYCLE = 5;
    export const HOST_UNREACHABLE = 6;
    export const HOST_NOT_FOUND = 7;
    export const UNKNOWN_ERROR = 8;
    export const FAILED_TO_PARSE = 9;
    export const CANNOT_MUTATE_OBJECT = 10;
    export const USER_NOT_FOUND = 11;
    export const UNSUPPORTED_FORMAT = 12;
    export const UNAUTHORIZED = 13;
    export const TYPE_MISMATCH = 14;
    export const OVERFLOW = 15;
    export const INVALID_LENGTH = 16;
    export const PROTOCOL_ERROR = 17;
    export const AUTHENTICATION_FAILED = 18;
    export const CANNOT_REUSE_OBJECT = 19;
    export const ILLEGAL_OPERATION = 20;
    export const EMPTY_ARRAY_OPERATION = 21;
    export const INVALID_BSON = 22;
    export const ALREADY_INITIALIZED = 23;
    export const LOCK_TIMEOUT = 24;
    export const REMOTE_VALIDATION_ERROR = 25;
    export const NAMESPACE_NOT_FOUND = 26;
    export const INDEX_NOT_FOUND = 27;
    export const PATH_NOT_VIABLE = 28;
    export const NON_EXISTENT_PATH = 29;
    export const INVALID_PATH = 30;
    export const ROLE_NOT_FOUND = 31;
    export const ROLES_NOT_RELATED = 32;
    export const PRIVILEGE_NOT_FOUND = 33;
    export const CANNOT_BACKFILL_ARRAY = 34;
    export const USER_MODIFICATION_FAILED = 35;
    export const REMOTE_CHANGE_DETECTED = 36;
    export const FILE_RENAME_FAILED = 37;
    export const FILE_NOT_OPEN = 38;
    export const FILE_STREAM_FAILED = 39;
    export const CONFLICTING_UPDATE_OPERATORS = 40;
    export const FILE_ALREADY_OPEN = 41;
    export const LOG_WRITE_FAILED = 42;
    export const CURSOR_NOT_FOUND = 43;
    export const USER_DATA_INCONSISTENT = 45;
    export const LOCK_BUSY = 46;
    export const NO_MATCHING_DOCUMENT = 47;
    export const NAMESPACE_EXISTS = 48;
    export const INVALID_ROLE_MODIFICATION = 49;
    export const EXCEEDED_TIME_LIMIT = 50;
    export const MANUAL_INTERVENTION_REQUIRED = 51;
    export const DOLLAR_PREFIXED_FIELD_NAME = 52;
    export const INVALID_ID_FIELD = 53;
    export const NOT_SINGLE_VALUE_FIELD = 54;
    export const INVALID_DBREF = 55;
    export const EMPTY_FIELD_NAME = 56;
    export const DOTTED_FIELD_NAME = 57;
    export const ROLE_MODIFICATION_FAILED = 58;
    export const COMMAND_NOT_FOUND = 59;
    export const OBSOLETE_DATABASE_NOT_FOUND = 60;
    export const SHARD_KEY_NOT_FOUND = 61;
    export const OPLOG_OPERATION_UNSUPPORTED = 62;
    export const STALE_SHARD_VERSION = 63;
    export const WRITE_CONCERN_FAILED = 64;
    export const MULTIPLE_ERRORS_OCCURRED = 65;
    export const IMMUTABLE_FIELD = 66;
    export const CANNOT_CREATE_INDEX = 67;
    export const INDEX_ALREADY_EXISTS = 68;
    export const AUTH_SCHEMA_INCOMPATIBLE = 69;
    export const SHARD_NOT_FOUND = 70;
    export const REPLICA_SET_NOT_FOUND = 71;
    export const INVALID_OPTIONS = 72;
    export const INVALID_NAMESPACE = 73;
    export const NODE_NOT_FOUND = 74;
    export const WRITE_CONCERN_LEGACY_OK = 75;
    export const NO_REPLICATION_ENABLED = 76;
    export const OPERATION_INCOMPLETE = 77;
    export const COMMAND_RESULT_SCHEMA_VIOLATION = 78;
    export const UNKNOWN_REPL_WRITE_CONCERN = 79;
    export const ROLE_DATA_INCONSISTENT = 80;
    export const NO_MATCH_PARSE_CONTEXT = 81;
    export const NO_PROGRESS_MADE = 82;
    export const REMOTE_RESULTS_UNAVAILABLE = 83;
    export const DUPLICATE_KEY_VALUE = 84;
    export const INDEX_OPTIONS_CONFLICT = 85;
    export const INDEX_KEY_SPECS_CONFLICT = 86;
    export const CANNOT_SPLIT = 87;
    export const SPLIT_FAILED_OBSOLETE = 88;
    export const NETWORK_TIMEOUT = 89;
    export const CALLBACK_CANCELED = 90;
    export const SHUTDOWN_IN_PROGRESS = 91;
    export const SECONDARY_AHEAD_OF_PRIMARY = 92;
    export const INVALID_REPLICA_SET_CONFIG = 93;
    export const NOT_YET_INITIALIZED = 94;
    export const NOT_SECONDARY = 95;
    export const OPERATION_FAILED = 96;
    export const NO_PROJECTION_FOUND = 97;
    export const DBPATH_IN_USE = 98;
    export const CANNOT_SATISFY_WRITE_CONCERN = 100;
    export const OUTDATED_CLIENT = 101;
    export const INCOMPATIBLE_AUDIT_METADATA = 102;
    export const NEW_REPLICA_SET_CONFIGURATION_INCOMPATIBLE = 103;
    export const NODE_NOT_ELECTABLE = 104;
    export const INCOMPATIBLE_SHARDING_METADATA = 105;
    export const DISTRIBUTED_CLOCK_SKEWED = 106;
    export const LOCK_FAILED = 107;
    export const INCONSISTENT_REPLICA_SET_NAMES = 108;
    export const CONFIGURATION_IN_PROGRESS = 109;
    export const CANNOT_INITIALIZE_NODE_WITH_DATA = 110;
    export const NOT_EXACT_VALUE_FIELD = 111;
    export const WRITE_CONFLICT = 112;
    export const INITIAL_SYNC_FAILURE = 113;
    export const INITIAL_SYNC_OPLOG_SOURCE_MISSING = 114;
    export const COMMAND_NOT_SUPPORTED = 115;
    export const DOC_TOO_LARGE_FOR_CAPPED = 116;
    export const CONFLICTING_OPERATION_IN_PROGRESS = 117;
    export const NAMESPACE_NOT_SHARDED = 118;
    export const INVALID_SYNC_SOURCE = 119;
    export const OPLOG_START_MISSING = 120;
    export const DOCUMENT_VALIDATION_FAILURE = 121; // Only for the document validator on collections.
    export const OBSOLETE_READ_AFTER_OPTIME_TIMEOUT = 122;
    export const NOT_AREPLICA_SET = 123;
    export const INCOMPATIBLE_ELECTION_PROTOCOL = 124;
    export const COMMAND_FAILED = 125;
    export const RPCPROTOCOL_NEGOTIATION_FAILED = 126;
    export const UNRECOVERABLE_ROLLBACK_ERROR = 127;
    export const LOCK_NOT_FOUND = 128;
    export const LOCK_STATE_CHANGE_FAILED = 129;
    export const SYMBOL_NOT_FOUND = 130;
    export const RLPINITIALIZATION_FAILED = 131;
    export const OBSOLETE_CONFIG_SERVERS_INCONSISTENT = 132;
    export const FAILED_TO_SATISFY_READ_PREFERENCE = 133;
    export const READ_CONCERN_MAJORITY_NOT_AVAILABLE_YET = 134;
    export const STALE_TERM = 135;
    export const CAPPED_POSITION_LOST = 136;
    export const INCOMPATIBLE_SHARDING_CONFIG_VERSION = 137;
    export const REMOTE_OPLOG_STALE = 138;
    export const JSINTERPRETER_FAILURE = 139;
    export const INVALID_SSLCONFIGURATION = 140;
    export const SSLHANDSHAKE_FAILED = 141;
    export const JSUNCATCHABLE_ERROR = 142;
    export const CURSOR_IN_USE = 143;
    export const INCOMPATIBLE_CATALOG_MANAGER = 144;
    export const POOLED_CONNECTIONS_DROPPED = 145;
    export const EXCEEDED_MEMORY_LIMIT = 146;
    export const ZLIB_ERROR = 147;
    export const READ_CONCERN_MAJORITY_NOT_ENABLED = 148;
    export const NO_CONFIG_MASTER = 149;
    export const STALE_EPOCH = 150;
    export const OPERATION_CANNOT_BE_BATCHED = 151;
    export const OPLOG_OUT_OF_ORDER = 152;
    export const CHUNK_TOO_BIG = 153;
    export const INCONSISTENT_SHARD_IDENTITY = 154;
    export const CANNOT_APPLY_OPLOG_WHILE_PRIMARY = 155;
    export const NEEDS_DOCUMENT_MOVE = 156;
    export const CAN_REPAIR_TO_DOWNGRADE = 157;
    export const MUST_UPGRADE = 158;
    export const DURATION_OVERFLOW = 159;
    export const MAX_STALENESS_OUT_OF_RANGE = 160;
    export const INCOMPATIBLE_COLLATION_VERSION = 161;
    export const COLLECTION_IS_EMPTY = 162;
    export const ZONE_STILL_IN_USE = 163;
    export const INITIAL_SYNC_ACTIVE = 164;
    export const VIEW_DEPTH_LIMIT_EXCEEDED = 165;
    export const COMMAND_NOT_SUPPORTED_ON_VIEW = 166;
    export const OPTION_NOT_SUPPORTED_ON_VIEW = 167;
    export const INVALID_PIPELINE_OPERATOR = 168;
    export const COMMAND_ON_SHARDED_VIEW_NOT_SUPPORTED_ON_MONGOD = 169;
    export const TOO_MANY_MATCHING_DOCUMENTS = 170;
    export const CANNOT_INDEX_PARALLEL_ARRAYS = 171;
    export const TRANSPORT_SESSION_CLOSED = 172;
    export const TRANSPORT_SESSION_NOT_FOUND = 173;
    export const TRANSPORT_SESSION_UNKNOWN = 174;
    export const QUERY_PLAN_KILLED = 175;
    export const FILE_OPEN_FAILED = 176;
    export const ZONE_NOT_FOUND = 177;
    export const RANGE_OVERLAP_CONFLICT = 178;
    export const WINDOWS_PDH_ERROR = 179;
    export const BAD_PERF_COUNTER_PATH = 180;
    export const AMBIGUOUS_INDEX_KEY_PATTERN = 181;
    export const INVALID_VIEW_DEFINITION = 182;
    export const CLIENT_METADATA_MISSING_FIELD = 183;
    export const CLIENT_METADATA_APP_NAME_TOO_LARGE = 184;
    export const CLIENT_METADATA_DOCUMENT_TOO_LARGE = 185;
    export const CLIENT_METADATA_CANNOT_BE_MUTATED = 186;
    export const LINEARIZABLE_READ_CONCERN_ERROR = 187;
    export const INCOMPATIBLE_SERVER_VERSION = 188;
    export const PRIMARY_STEPPED_DOWN = 189;
    export const MASTER_SLAVE_CONNECTION_FAILURE = 190;
    export const OBSOLETE_BALANCER_LOST_DISTRIBUTED_LOCK = 191;
    export const FAIL_POINT_ENABLED = 192;
    export const NO_SHARDING_ENABLED = 193;
    export const BALANCER_INTERRUPTED = 194;
    export const VIEW_PIPELINE_MAX_SIZE_EXCEEDED = 195;
    export const INVALID_INDEX_SPECIFICATION_OPTION = 197;
    export const OBSOLETE_RECEIVED_OP_REPLY_MESSAGE = 198;
    export const REPLICA_SET_MONITOR_REMOVED = 199;
    export const CHUNK_RANGE_CLEANUP_PENDING = 200;
    export const CANNOT_BUILD_INDEX_KEYS = 201;
    export const NETWORK_INTERFACE_EXCEEDED_TIME_LIMIT = 202;
    export const SHARDING_STATE_NOT_INITIALIZED = 203;
    export const TIME_PROOF_MISMATCH = 204;
    export const CLUSTER_TIME_FAILS_RATE_LIMITER = 205;
    export const NO_SUCH_SESSION = 206;
    export const INVALID_UUID = 207;
    export const TOO_MANY_LOCKS = 208;
    export const STALE_CLUSTER_TIME = 209;
    export const CANNOT_VERIFY_AND_SIGN_LOGICAL_TIME = 210;
    export const KEY_NOT_FOUND = 211;
    export const INCOMPATIBLE_ROLLBACK_ALGORITHM = 212;
    export const DUPLICATE_SESSION = 213;
    export const AUTHENTICATION_RESTRICTION_UNMET = 214;
    export const DATABASE_DROP_PENDING = 215;
    export const ELECTION_IN_PROGRESS = 216;
    export const INCOMPLETE_TRANSACTION_HISTORY = 217;
    export const UPDATE_OPERATION_FAILED = 218;
    export const FTDCPATH_NOT_SET = 219;
    export const FTDCPATH_ALREADY_SET = 220;
    export const INDEX_MODIFIED = 221;
    export const CLOSE_CHANGE_STREAM = 222;
    export const ILLEGAL_OP_MSG_FLAG = 223;
    export const QUERY_FEATURE_NOT_ALLOWED = 224;
    export const TRANSACTION_TOO_OLD = 225;
    export const ATOMICITY_FAILURE = 226;
    export const CANNOT_IMPLICITLY_CREATE_COLLECTION = 227;
    export const SESSION_TRANSFER_INCOMPLETE = 228;
    export const MUST_DOWNGRADE = 229;
    export const DNSHOST_NOT_FOUND = 230;
    export const DNSPROTOCOL_ERROR = 231;
    export const MAX_SUB_PIPELINE_DEPTH_EXCEEDED = 232;
    export const TOO_MANY_DOCUMENT_SEQUENCES = 233;
    export const RETRY_CHANGE_STREAM = 234;
    // this function or module is not available on this platform or configuration
    export const INTERNAL_ERROR_NOT_SUPPORTED = 235;
    export const FOR_TESTING_ERROR_EXTRA_INFO = 236;
    export const CURSOR_KILLED = 237;
    export const NOT_IMPLEMENTED = 238;
    export const SNAPSHOT_TOO_OLD = 239;
    export const DNSRECORD_TYPE_MISMATCH = 240;
    export const CONVERSION_FAILURE = 241;
    export const CANNOT_CREATE_COLLECTION = 242;
    export const INCOMPATIBLE_WITH_UPGRADED_SERVER = 243;
    export const TRANSACTION_ABORTED = 244;
    export const BROKEN_PROMISE = 245;
    export const SNAPSHOT_UNAVAILABLE = 246;
    export const PRODUCER_CONSUMER_QUEUE_BATCH_TOO_LARGE = 247;
    export const PRODUCER_CONSUMER_QUEUE_END_CLOSED = 248;
    export const STALE_DB_VERSION = 249;

    // Error codes 4000-8999 are reserved.
    // Non-sequential error codes (for compatibility only)

    export const SOCKET_EXCEPTION = 9001;
    export const OBSOLETE_RECV_STALE_CONFIG = 9996;
    export const NOT_MASTER = 10107;
    export const CANNOT_GROW_DOCUMENT_IN_CAPPED_NAMESPACE = 10003;
    export const DUPLICATE_KEY = 11000;
    export const INTERRUPTED_AT_SHUTDOWN = 11600;
    export const INTERRUPTED = 11601;
    export const INTERRUPTED_DUE_TO_REPL_STATE_CHANGE = 11602;
    export const OUT_OF_DISK_SPACE = 14031;
    export const KEY_TOO_LONG = 17280;
    export const BACKGROUND_OPERATION_IN_PROGRESS_FOR_DATABASE = 12586;
    export const BACKGROUND_OPERATION_IN_PROGRESS_FOR_NAMESPACE = 12587;
    export const NOT_MASTER_OR_SECONDARY = 13436;
    export const NOT_MASTER_NO_SLAVE_OK = 13435;
    export const SHARD_KEY_TOO_BIG = 13334;
    export const STALE_CONFIG = 13388;
    export const DATABASE_DIFFER_CASE = 13297;
    export const OBSOLETE_PREPARE_CONFIGS_FAILED = 13104;
  }

  export class ObjectId extends MongoDBObjectID {}
  export class ObjectID extends MongoDBObjectID {}

  interface CollectionIndex {
    collection: Collection;
    index: Index;
  }

  export interface Index {
    spec: { [key: string]: -1 | 1 | '2dsphere' | 'text' | '2d' | 'geoHaystack' | 'hashed' };
    options?: mongodb.IndexOptions;
  }

  export interface CollectionOptions {
    collectionName: string;
    collectionOptions?: mongodb.DbCollectionOptions;
    indexes?: Index[];
  }

  /* tslint:disable:max-line-length */
  export interface Collection<T = any> extends mongodb.Collection<T> {
    insertOne(docs: T, callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>): void;

    insertOne(docs: T, options?: mongodb.CollectionInsertOneOptions): Promise<mongodb.InsertOneWriteOpResult>;

    insertOne(
      docs: T,
      options: mongodb.CollectionInsertOneOptions,
      callback: mongodb.MongoCallback<mongodb.InsertOneWriteOpResult>,
    ): void;

    insertMany(docs: T[], callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>): void;

    insertMany(docs: T[], options?: mongodb.CollectionInsertManyOptions): Promise<mongodb.InsertWriteOpResult>;

    insertMany(
      docs: T[],
      options: mongodb.CollectionInsertManyOptions,
      callback: mongodb.MongoCallback<mongodb.InsertWriteOpResult>,
    ): void;
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
        useNewUrlParser: true,
        appname: process.env.APP,
      }, options)).then((mongoClient: mongodb.MongoClient) => {
        const match = url.match(/mongodb:\/\/[^/]+\/([^?]+)/);

        if (!match) {
          throw new Error('failed to parse mognodb url');
        }

        this.client = mongoClient;

        // fix nasty mongodb driver bug when authSource is used as target db name
        this.db = mongoClient.db(match[1] || undefined);
      });

      await this.ensureIndexes();
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async ensureIndexes() {
      await Promise.all(this.indexes.map(async (item: CollectionIndex) => {
        return item.collection.createIndex(item.index.spec, item.index.options).catch((e) => {
          const spec = JSON.stringify(item.index);

          throw new Error(`An error occurred while creating an index: ${e.message}; ${spec}`);
        });
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
     * @returns {MongoClient}
     */
    getClient(): mongodb.MongoClient {
      if (!this.client) {
        throw new Error('Not connected');
      }

      return this.client;
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
          const collection = <any>this.getCollection(collectionName, collectionOptions);

          if (typeof collection[name] === 'function') {
            return (...args: any[]) => collection[name](...args);
          }

          return collection[name];
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
