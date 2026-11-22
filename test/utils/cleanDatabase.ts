import container from '../../src/container';

export default function cleanDatabase(): Promise<unknown> {
  const { database } = container.cradle;

  if (!database) {
    throw new Error('Database is not configured; integration tests need a reachable MySQL instance.');
  }

  return database.truncate({ cascade: true });
}