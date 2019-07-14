import { DocumentMap } from './interfaces';

const $INDEXERS = Symbol('mongodb:index-map:indexers');

interface Indexer<T> {
  map: DocumentMap<T>;
  keyFn: (doc: T) => string;
}

type Indexers<T> = Array<Indexer<T>>;

export class IndexMap<T> extends Map<string, T> {
  private readonly [$INDEXERS]: Indexers<T>;

  constructor() {
    super();

    Object.defineProperty(this, $INDEXERS, {
      enumerable: false,
      writable: false,
      configurable: false,
      value: [],
    });
  }

  /**
   *
   * @param key
   * @param value
   */
  set(key: string, value: T): this {
    const existingDoc = this.get(key);
    if (existingDoc) {
      this[$INDEXERS].forEach((indexer) => {
        try {
          indexer.map.delete(indexer.keyFn(existingDoc));
        } catch {
        }
      });
    }

    this[$INDEXERS].forEach((indexer) => {
      try {
        indexer.map.set(indexer.keyFn(value), value);
      } catch {

      }
    });

    return super.set(key, value);
  }

  /**
   *
   * @param indexer
   */
  addIndexer(indexer: Indexer<T>): this {
    this[$INDEXERS].push(indexer);

    return this;
  }

  /**
   *
   * @param key
   */
  has(key: string) {
    return super.has(key);
  }

  /**
   *
   * @param key
   */
  delete(key: string) {
    const value = this.get(key);

    if (!value) {
      return false;
    }


    this[$INDEXERS].forEach((indexer) => {
      try {
        indexer.map.delete(indexer.keyFn(value));
      } catch {
      }
    });

    return super.delete(key);
  }
}
