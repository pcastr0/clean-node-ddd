import express, { type Express, type RequestHandler } from 'express';
import type { Logger } from 'log4js';
import type { Config } from '../../../config';

export class Server {
  private readonly config: Config;
  private readonly logger: Logger;
  readonly express: Express;

  constructor({ config, router, logger }: { config: Config; router: RequestHandler; logger: Logger }) {
    this.config = config;
    this.logger = logger;
    this.express = express();

    this.express.disable('x-powered-by');
    this.express.use(router);
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.express.listen(this.config.web.port, () => {
        // In cluster workers (PM2/cluster.ts) `http.address()` can be null —
        // the primary process owns the socket — so log the configured port.
        this.logger.info(`[p ${process.pid}] Listening at port ${this.config.web.port}`);
        resolve();
      });
    });
  }
}