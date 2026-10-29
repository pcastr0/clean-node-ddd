import path from 'path';
import type { EnvSettings } from '..';

const logPath = path.join(__dirname, '../../logs/development.log');

export default {
  web: {
    port: 3000
  },
  logging: {
    appenders: {
      out: { type: 'console' },
      task: {
        type: 'file',
        filename: logPath
      }
    },
    categories: {
      default: { appenders: ['out', 'task'], level: 'info' }
    }
  }
} satisfies EnvSettings;