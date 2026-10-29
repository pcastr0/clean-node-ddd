import { expect } from 'chai';
import { UpdateUser } from '../../../../src/app/user/UpdateUser';
import { User } from '../../../../src/domain/user/User';
import { ValidationError } from '../../../../src/domain/errors/ValidationError';
import { NotFoundError } from '../../../../src/domain/errors/NotFoundError';

const storedUser = {
  id: 123,
  firstName: 'Patrick',
  middleName: 'Corpuz',
  lastName: 'Castro',
  email: 'patrickp.castro@gmail.com',
  contactNumber: '+639155634242'
};

const userData = { firstName: 'UpdatedName' };

describe('App :: User :: UpdateUser', () => {
  context('when user exists', () => {
    context('when data is valid', () => {
      it('updates and returns the user', async () => {
        const updateUser = new UpdateUser({
          usersRepository: {
            update: async (_id, data) => new User({ ...storedUser, ...data })
          }
        });

        const user = await updateUser.execute(123, userData);

        expect(user.id).to.equal(123);
        expect(user.firstName).to.equal('UpdatedName');
      });
    });

    context('when data is invalid', () => {
      it('propagates the validation error', async () => {
        const updateUser = new UpdateUser({
          usersRepository: {
            update: async () => {
              throw new ValidationError([
                { message: '"firstName" is not allowed to be empty', path: ['firstName'] }
              ]);
            }
          }
        });

        try {
          await updateUser.execute(123, userData);
          expect.fail('should have thrown');
        } catch (err) {
          expect(err).to.be.instanceOf(ValidationError);
        }
      });
    });
  });

  context('when the user does not exist', () => {
    it('propagates the not-found error', async () => {
      const updateUser = new UpdateUser({
        usersRepository: {
          update: async () => {
            throw new NotFoundError('User with id 123 can\'t be found.');
          }
        }
      });

      try {
        await updateUser.execute(123, userData);
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
      }
    });
  });

  context('when there is an internal error', () => {
    it('propagates the error', async () => {
      const updateUser = new UpdateUser({
        usersRepository: {
          update: async () => {
            throw new Error('Some Error');
          }
        }
      });

      try {
        await updateUser.execute(123, userData);
        expect.fail('should have thrown');
      } catch (err) {
        expect((err as Error).message).to.equal('Some Error');
      }
    });
  });
});