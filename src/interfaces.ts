export interface DocumentMap<T> {
  set(key: string, value: T): this;

  has(key: string): boolean;

  delete(key: string): boolean;
}
