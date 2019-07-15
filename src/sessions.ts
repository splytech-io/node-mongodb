import { MongoDB } from './index';

export async function retryTransactionFailures<T>(
  handler: () => Promise<T>,
  retries: number,
): Promise<T> {
  return handler().catch(async (error) => {
    // If transient error, retry the whole transaction
    if (
      error.errorLabels &&
      error.errorLabels.includes('TransientTransactionError') &&
      retries > 0
    ) {
      await new Promise((r) => setTimeout(r, Math.ceil(Math.random() * 1000)));

      return retryTransactionFailures(handler, retries - 1);
    }

    throw error;
  });
}

/**
 *
 * @param {MongoDB.ClientSession} session
 * @param {number} attempt
 * @returns {Promise<void>}
 */
async function commitWithRetry(session: MongoDB.ClientSession, attempt: number = 0): Promise<void> {
  await session.commitTransaction().catch(async (error) => {
    if (
      error.errorLabels &&
      error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0 &&
      attempt < 5
    ) {
      return commitWithRetry(session, attempt + 1);
    }

    throw error;
  });
}

export interface CreateTransactionOptions {
  retries?: number;
  connection?: MongoDB.Connection;
}

export async function createTransaction<T>(
  fn: (session: MongoDB.ClientSession, commitWithRetry: () => Promise<void>) => Promise<T>,
  options: CreateTransactionOptions = {},
): Promise<T> {
  const { retries = 0, connection = MongoDB.connection } = options;

  return retryTransactionFailures<T>(async () => {
    return new Promise<T>((resolve, reject) => {

      connection.getClient().withSession(async (session) => {
        session.startTransaction({
          readConcern: { level: 'snapshot' },
          writeConcern: { w: 'majority' },
        });

        await fn(session, () => commitWithRetry(session)).finally(async () => {
          if (!session.inTransaction()) {
            return;
          }

          await session.abortTransaction();
        }).then(resolve);
      }).catch(reject);

    });
  }, retries);
}
