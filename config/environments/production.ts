import type { EnvSettings } from '..';

export default {
  web: {
    port: Number(process.env.PORT ?? 3000)
  },
  logging: {
    appenders: { out: { type: 'console', layout: { type: 'basic' } } },
    categories: { default: { appenders: ['out'], level: 'info' } }
  }
} satisfies EnvSettings;