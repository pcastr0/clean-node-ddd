import morgan from 'morgan';
import type { Logger } from 'log4js';
import { LoggerStreamAdapter } from '../../../infra/logging/LoggerStreamAdapter';

export default ({ logger }: { logger: Logger }) =>
  morgan('dev', {
    stream: LoggerStreamAdapter.toStream(logger)
  });