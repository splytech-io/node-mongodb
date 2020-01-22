import { MongoDB } from './index';
import { ObjectMap } from './types';
import _ = require('lodash');


export function throttle(fn: () => Promise<void>): () => void {
  let running = false;

  return () => {
    if (running) {
      return;
    }

    running = true;
    fn().finally(() => running = false).catch(() => null);
  };
}

/**
 *
 * @param {ObjectMap<any>} filter
 * @returns {(item: any) => boolean}
 */
export function matchesFilter(filter: ObjectMap<any>): (item: any) => boolean {
  return (item: any): boolean => {
    return Object.entries(filter).every(([key, expectedValue]) => {
      const actualValue: any = _.get(item, key);

      switch (true) {
        case typeof actualValue === 'object' && MongoDB.ObjectID.isValid(actualValue)
        && typeof expectedValue === 'object' && MongoDB.ObjectID.isValid(expectedValue):
          return actualValue.equals(expectedValue);
        default:
          return actualValue === expectedValue;
      }
    });
  };
}
