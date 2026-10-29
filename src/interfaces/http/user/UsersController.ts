import { Router, type NextFunction, type Request, type Response } from 'express';
import { inject } from 'awilix-express';
import Status from 'http-status';
import type { Cradle } from '../../../container';
import type { UserData } from '../../../domain/user/User';
import { handleDomainError } from '../errors/domainErrorResponder';

const index = inject(({ getAllUsers, userSerializer }: Cradle) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await getAllUsers.execute();
      res.status(Status.OK).json(users.map((user) => userSerializer.serialize(user)));
    } catch (err) {
      handleDomainError(err, res, next);
    }
  });

const show = inject(({ getUser, userSerializer }: Cradle) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getUser.execute(Number(req.params.id));
      res.status(Status.OK).json(userSerializer.serialize(user));
    } catch (err) {
      handleDomainError(err, res, next);
    }
  });

const create = inject(({ createUser, userSerializer }: Cradle) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await createUser.execute(req.body as UserData);
      res.status(Status.CREATED).json(userSerializer.serialize(user));
    } catch (err) {
      handleDomainError(err, res, next);
    }
  });

const update = inject(({ updateUser, userSerializer }: Cradle) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await updateUser.execute(Number(req.params.id), req.body as Partial<UserData>);
      res.status(Status.ACCEPTED).json(userSerializer.serialize(user));
    } catch (err) {
      handleDomainError(err, res, next);
    }
  });

const remove = inject(({ deleteUser }: Cradle) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteUser.execute(Number(req.params.id));
      res.status(Status.ACCEPTED).end();
    } catch (err) {
      handleDomainError(err, res, next);
    }
  });

export const usersRouter: Router = Router()
  .get('/', index)
  .get('/:id', show)
  .post('/', create)
  .put('/:id', update)
  .delete('/:id', remove);