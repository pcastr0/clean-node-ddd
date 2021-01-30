const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./utils/createControllerRoutes');

module.exports = ({ config }) => {

  const router = Router();

  if (config.env === 'development') {
    router.use(statusMonitor());
  }

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression());

  apiRouter.use('/test', controller('hello/helloController'));

  router.use('/api', apiRouter);

  return router;

}