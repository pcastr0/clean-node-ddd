import log4js from 'log4js';
import type { Config } from '../../../config';

export default ({ config }: { config: Config }): log4js.Logger => {
  log4js.configure(config.logging);

  return log4js.getLogger();
};