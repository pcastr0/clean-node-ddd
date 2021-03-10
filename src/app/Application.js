class Application {
  constructor({ server, database, logger }) {
    this.server = server;
    this.database = database;
    this.logger = logger;

  }

  async start() {
    if (this.database) {
      try {
        await this.database;
        this.logger.info('Application started Successfully.');
      } catch (err) {
        this.logger.error('Internel Server Error.', err.message);
      }
    }

    await this.server.start();
  }
}

module.exports = Application;
