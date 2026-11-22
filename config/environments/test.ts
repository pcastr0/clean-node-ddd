import type { EnvSettings } from '..';

export default {
  web: {
    port: 3000
  },
  logging: {
    appenders: {
      out: { type: 'console' }
    },
    categories: {
      default: { appenders: ['out'], level: 'error' }
    }
  }
} satisfies EnvSettings;