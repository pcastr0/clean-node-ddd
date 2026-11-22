import type { Logger } from 'log4js';

export const LoggerStreamAdapter = {
  toStream(logger: Logger): { write(message: string): void } {
    return {
      write(message: string) {
        logger.info(message.slice(0, -1));
      }
    };
  }
};