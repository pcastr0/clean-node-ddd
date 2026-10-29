import type { Sequelize } from 'sequelize';
import type { Logger } from 'log4js';
import type { Server } from '../interfaces/http/Server';

export class Application {
  private readonly server: Server;
  private readonly database: Sequelize | undefined;
  private readonly logger: Logger;

  constructor({ server, database, logger }: { server: Server; database: Sequelize | undefined; logger: Logger }) {
    this.server = server;
    this.database = database;
    this.logger = logger;

    // Sequelize's public typings don't expose `options`; route SQL logging to
    // the app logger when the db config enables it.
    const withOptions = database as unknown as { options: { logging?: unknown } } | undefined;

    if (withOptions && withOptions.options.logging) {
      withOptions.options.logging = logger.info.bind(logger);
    }
  }

  async start(): Promise<void> {
    if (this.database) {
      try {
        await this.database.authenticate();
        this.logger.info('Database is connected.');
      } catch (err) {
        this.logger.error('Unable to connect to Database.', (err as Error).message);
      }
    }

    await this.server.start();
  }
}