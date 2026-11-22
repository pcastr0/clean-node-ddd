import { expect } from 'chai';
import { GetAllUsers } from '../../../../src/app/user/GetAllUsers';
import { User } from '../../../../src/domain/user/User';

describe('App :: User :: GetAllUsers', () => {
  context('when the query is successful', () => {
    it('returns all the users', async () => {
      const getAllUsers = new GetAllUsers({
        usersRepository: {
          getAll: async () => [
            new User({ id: 1, firstName: 'Patrick' }),
            new User({ id: 2, firstName: 'Paul' })
          ]
        }
      });

      const users = await getAllUsers.execute();

      expect(users).to.have.lengthOf(2);
      expect(users[0].firstName).to.equal('Patrick');
      expect(users[1].firstName).to.equal('Paul');
    });
  });

  context('when there is an internal error', () => {
    it('propagates the error', async () => {
      const getAllUsers = new GetAllUsers({
        usersRepository: {
          getAll: async () => {
            throw new Error('Failed');
          }
        }
      });

      try {
        await getAllUsers.execute();
        expect.fail('should have thrown');
      } catch (err) {
        expect((err as Error).message).to.equal('Failed');
      }
    });
  });
});