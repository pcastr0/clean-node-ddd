const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const UserController = {
  get router() {
    const router = Router();

    router.get('/', this.index);
    router.get('/:id', this.show);
    router.post('/', this.create);
  
    return router;
  },

  index: inject(({ getAllUsers, userSerializer }) => 
    (req, res, next) => {
      const { SUCCESS, ERROR } = getAllUsers.outputs;

      getAllUsers
        .on(SUCCESS, (users) => {
          res
            .status(Status.OK)
            .json(users.map(userSerializer.serialize));
        })
        .on(ERROR, next);

      getAllUsers.execute();
    }
  ),

  show: inject(({ getUser, userSerializer }) => 
    (req, res, next) => {
      const { SUCCESS, ERROR, NOT_FOUND } = getUser.outputs;

      getUser
        .on(SUCCESS, (user) => {
          res
            .status(Status.OK)
            .json(userSerializer.serialize(user));
        })
        .on(NOT_FOUND, (error) => {
          res.status(Status.NOT_FOUND).json({
            type: 'NotFoundError',
            details: error.details
          });
        })
        .on(ERROR, next);

      getUser.execute(Number(req.params.id));
    }
  ),

  create: inject(({ createUser, userSerializer }) =>
    (req, res, next) => {
      const { SUCCESS, ERROR, VALIDATION_ERROR } = createUser.outputs;

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