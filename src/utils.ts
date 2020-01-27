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
    return Object.entries(filter).every(([key, expectation]) => {
      const comparator = parseExpectation(expectation);
      const actualValue: any = _.get(item, key);

      return comparator(actualValue);
    });
  };

  function parseExpectation(expectation: any) {
    if (typeof expectation === 'object') {
      if (expectation.$gt) {
        return compareGT(expectation.$gt);
      }
      if (expectation.$gte) {
        return compareGTE(expectation.$gte);
      }
      if (expectation.$lt) {
        return compareLT(expectation.$lt);
      }
      if (expectation.$lte) {
        return compareLTE(expectation.$lte);
      }
    }

    return compareEquals(expectation);
  }

  function compareGT(expectedValue: any) {
    return (actualValue: any): boolean => {
      switch (true) {
        default:
          return actualValue > expectedValue;
      }
    };
  }

  function compareGTE(expectedValue: any) {
    return (actualValue: any): boolean => {
      switch (true) {
        default:
          return actualValue >= expectedValue;
      }
    };
  }

  function compareLT(expectedValue: any) {
    return (actualValue: any): boolean => {
      switch (true) {
        default:
          return actualValue < expectedValue;
      }
    };
  }

  function compareLTE(expectedValue: any) {
    return (actualValue: any): boolean => {
      switch (true) {
        default:
          return actualValue <= expectedValue;
      }
    };
  }

  function compareEquals(expectedValue: any) {
    return (actualValue: any): boolean => {
      switch (true) {
        case isObjectID(actualValue) && isObjectID(expectedValue):
          return `${ actualValue }` === `${ expectedValue }`;
        case actualValue instanceof Date && expectedValue instanceof Date:
          return actualValue.getTime() === expectedValue.getTime();
        default:
          return actualValue === expectedValue;
      }
    };
  }

  function isObjectID(value: any): boolean {
    return typeof value === 'object' && value._bsontype === 'ObjectID';
  }
}
