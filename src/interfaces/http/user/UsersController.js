const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const UserController = {
  get router() {
    const router = Router();

    router.post('/', this.create);

    return router;
  },

  create: inject(({createUser, userSerializer}) =>
    (req, res, next) => {
      const {SUCCESS, ERROR, VALIDATION_ERROR} = createUser.outputs;

      createUser
        .on(SUCCESS, (user) => {
          res
            .status(Status.CREATED)
            .json(userSerializer.serialize(user));
        })
        .on(VALIDATION_ERROR, (error) => {
          res.status(Status.BAD_REQUEST).json({
            type: 'ValidationError',
            details: error.details
          });
        })
        .on(ERROR, next);

      createUser.execute(req.body);
    }
  ),
};

module.exports = UserController;