const Status = require('http-status');

/* istanbul ignore next */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { logger } = req.container.cradle;

  logger.error(err);

  res.status(Status.INTERNAL_SERVER_ERROR).json({
    type: 'InternalServerError',
    message: err.message,
    stack: err.stack
  });

};