class Application {
  constructor({ server, database, logger }) {
    this.server = server;
    this.database = database;
    this.logger = logger;

    if(database && database.options.logging) {
      database.options.logging = logger.info.bind(logger);
    }
  }

  async start() {
    if (this.database) {
      try {
        await this.database.authenticate();
        this.logger.info('Database is connected.');
      } catch (err) {
        this.logger.error('Unable to connect to Database.', err.message);
      }
    }

    await this.server.start();
  }
}

module.exports = Application;
