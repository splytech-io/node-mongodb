import { Cursor } from 'mongodb';

export function createWatchOperationTracker(collectionName: string) {
  let watchCount = 0;
  let timeout: NodeJS.Timer;

  const check = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (watchCount > 1) {
        console.warn(
          `⚠️ !!! WARNING !!! ⚠️ number of watch operations on collection ${ collectionName } is ${ watchCount }`,
        );
      }
    }, 100).unref();
  };

  return (cursor: Cursor) => {
    cursor.once('close', () => {
      watchCount--;
      check();
    });

    watchCount++;
    check();
  };
}
