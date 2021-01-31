const path = require('path');
const logPath = path.join(__dirname, '../../logs/development.log');

module.exports = {
  web: {
    port: 3000
  },
  logging: {
    appenders: {
      out: { type: 'console' },
      task: {
        type: 'file',
        filename: logPath,
      }
    },
    categories: {
      // default: { appenders: [ 'out' ], level: 'info' },
      default: { appenders: [ 'out', 'task' ], level: 'info' }
    }
  }
};
