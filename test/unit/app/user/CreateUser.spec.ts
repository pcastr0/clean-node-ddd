import { expect } from 'chai';
import { CreateUser } from '../../../../src/app/user/CreateUser';
import { ValidationError } from '../../../../src/domain/errors/ValidationError';

const userData = {
  firstName: 'Patrick',
  middleName: 'Corpuz',
  lastName: 'Castro',
  email: 'patrickp.castro@gmail.com',
  contactNumber: '+639155634242'
};

describe('App :: User :: CreateUser', () => {
  context('when user is valid', () => {
    it('creates and returns the new user', async () => {
      const createUser = new CreateUser({
        usersRepository: {
          add: async (user) => user
        }
      });

      const user = await createUser.execute(userData);

      expect(user.firstName).to.equal('Patrick');
      expect(user.middleName).to.equal('Corpuz');
      expect(user.lastName).to.equal('Castro');
      expect(user.email).to.equal('patrickp.castro@gmail.com');
      expect(user.contactNumber).to.equal('+639155634242');
    });
  });

  context('when user is invalid', () => {
    it('propagates the validation error', async () => {
      const createUser = new CreateUser({
        usersRepository: {
          add: async () => {
            throw new ValidationError([
              { message: '"email" must be a valid email', path: ['email'] }
            ]);
          }
        }
      });

      try {
        await createUser.execute(userData);
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(ValidationError);
      }
    });
  });

  context('when there is an internal error', () => {
    it('propagates the error', async () => {
      const createUser = new CreateUser({
        usersRepository: {
          add: async () => {
            throw new Error('Some Error');
          }
        }
      });

      try {
        await createUser.execute(userData);
        expect.fail('should have thrown');
      } catch (err) {
        expect((err as Error).message).to.equal('Some Error');
      }
    });
  });
});