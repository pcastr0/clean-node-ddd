class Application {
  constructor({ server, database, logger }) {
    this.server = server;
    this.database = database;
    this.logger = logger;

    // if(database && database.options.logging) {
    //   database.options.logging = logger.info.bind(logger);
    // }
  }

  async start() {
    if (this.database) {
      try {
        await this.database;
        console.log(this.database);
        this.logger.info('Server started Successfully.');
      } catch (err) {
        this.logger.error('Internal Server Error.', err.message);
      }
    }

    await this.server.start();
  }
}

module.exports = Application;
