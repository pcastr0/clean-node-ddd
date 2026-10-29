import { expect } from 'chai';
import { DeleteUser } from '../../../../src/app/user/DeleteUser';
import { NotFoundError } from '../../../../src/domain/errors/NotFoundError';

describe('App :: User :: DeleteUser', () => {
  context('when user exists', () => {
    it('deletes the user and returns nothing', async () => {
      const deleteUser = new DeleteUser({
        usersRepository: {
          remove: async () => undefined
        }
      });

      const result = await deleteUser.execute(187);

      expect(result).to.be.undefined;
    });
  });

  context('when user does not exist', () => {
    it('propagates the not-found error', async () => {
      const deleteUser = new DeleteUser({
        usersRepository: {
          remove: async () => {
            throw new NotFoundError('User with id 187 can\'t be found.');
          }
        }
      });

      try {
        await deleteUser.execute(187);
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
      }
    });
  });

  context('when there is an internal error', () => {
    it('propagates the error', async () => {
      const deleteUser = new DeleteUser({
        usersRepository: {
          remove: async () => {
            throw new Error('Some Error');
          }
        }
      });

      try {
        await deleteUser.execute(321);
        expect.fail('should have thrown');
      } catch (err) {
        expect((err as Error).message).to.equal('Some Error');
      }
    });
  });
});