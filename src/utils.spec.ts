import { expect } from 'chai';
import { MongoDB } from './index';
import { matchesFilter } from './utils';

describe('utils', () => {
  describe('matchesFilter', () => {
    describe('object id comparison', () => {
      it('should compare object id to object id = true', async () => {
        const id1 = new MongoDB.ObjectID('01'.repeat(12));
        const id2 = new MongoDB.ObjectID('01'.repeat(12));

        const result = matchesFilter({
          _id: id1,
        })({
          _id: id2,
        });

        expect(result).to.equals(true);
      });
      it('should compare object id to object id = false', async () => {
        const id1 = new MongoDB.ObjectID('01'.repeat(12));
        const id2 = new MongoDB.ObjectID('02'.repeat(12));

        const result = matchesFilter({
          _id: id1,
        })({
          _id: id2,
        });

        expect(result).to.equals(false);
      });
      it('should compare object id to string = false', async () => {
        const id1 = new MongoDB.ObjectID('01'.repeat(12));
        const id2 = new MongoDB.ObjectID('01'.repeat(12));

        const result = matchesFilter({
          _id: id1,
        })({
          _id: id2.toHexString(),
        });

        expect(result).to.equals(false);
      });
      it('should compare object id to object id gte = true', async () => {
        const id1 = new MongoDB.ObjectID('01'.repeat(12));
        const id2 = new MongoDB.ObjectID('01'.repeat(12));

        const result = matchesFilter({
          _id: {
            $gte: id1,
          },
        })({
          _id: id2,
        });

        expect(result).to.equals(true);
      });
      it('should compare object id to object id gt = false', async () => {
        const id1 = new MongoDB.ObjectID('01'.repeat(12));
        const id2 = new MongoDB.ObjectID('01'.repeat(12));

        const result = matchesFilter({
          _id: {
            $gt: id1,
          },
        })({
          _id: id2,
        });

        expect(result).to.equals(false);
      });
      it('should compare object id to object id lt = false', async () => {
        const id1 = new MongoDB.ObjectID('01'.repeat(12));
        const id2 = new MongoDB.ObjectID('02'.repeat(12));

        const result = matchesFilter({
          _id: {
            $lt: id1,
          },
        })({
          _id: id2,
        });

        expect(result).to.equals(false);
      });
    });
    describe('string id comparison', () => {
      it('should compare string to string = true', async () => {
        const result = matchesFilter({
          name: 'john',
        })({
          name: 'john',
        });

        expect(result).to.equals(true);
      });
      it('should compare string to string = false', async () => {
        const result = matchesFilter({
          name: 'john',
        })({
          name: 'john2',
        });

        expect(result).to.equals(false);
      });
    });
    describe('date comparison', () => {
      it('should compare date to date equals = true', async () => {
        const result = matchesFilter({
          created: new Date(0),
        })({
          created: new Date(0),
        });

        expect(result).to.equals(true);
      });
      it('should compare date to date gt = false', async () => {
        const result = matchesFilter({
          created: {
            $gt: new Date(1),
          },
        })({
          created: new Date(0),
        });

        expect(result).to.equals(false);
      });
      it('should compare date to date gt = true', async () => {
        const result = matchesFilter({
          created: {
            $gt: new Date(1),
          },
        })({
          created: new Date(2),
        });

        expect(result).to.equals(true);
      });
    });
  });
});
