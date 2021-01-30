const express = require('express');

class Server {
  constructor({ config }) {
    this.config = config;
    this.express = express();

    this.express.disable('x-powered-by');
  }

  start() {
    return new Promise((resolve) => {
      const http = this.express.listen(this.config.web.port, () => {
        const { port } = http.address();
        console.log(`Server Listenin at port ${port}`);
        resolve();
      });
    });
  }
}

module.exports = Server;