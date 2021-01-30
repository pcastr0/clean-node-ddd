const { Router } = require('express');
const { inject } = require('awilix-express');

const HelloController = {
  get router() {
    const router = Router();

    router.get('/', this.hello);

    return router;
  },

  hello(req, res, next) {
    res.send('Hello World!');
  }
}

module.exports = HelloController;