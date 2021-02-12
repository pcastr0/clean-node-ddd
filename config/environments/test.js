module.exports = {
  web: {
    port: 3000
  },
  logging: {
    appenders: {
      out: { type: 'console' },
    },
    categories: {
      // default: { appenders: [ 'out' ], level: 'info' },
      default: { appenders: ['out' ], level: 'error' }
    }
  }
};
