import { expect } from 'chai';
import { GetUser } from '../../../../src/app/user/GetUser';
import { User } from '../../../../src/domain/user/User';
import { NotFoundError } from '../../../../src/domain/errors/NotFoundError';

describe('App :: User :: GetUser', () => {
  context('when user exists', () => {
    it('returns the user', async () => {
      const getUser = new GetUser({
        usersRepository: {
          // A fake entity: the use case passes it through untouched, and it
          // keeps `birthday` a string so the passthrough is observable.
          getById: async (userId) => ({
            id: userId,
            firstName: 'Patrick',
            middleName: 'Corpuz',
            lastName: 'Castro',
            email: 'patrickp.castro@gmail.com',
            contactNumber: '+639155634242',
            address: 'Some address',
            gender: 'Male',
            birthday: '1994-04-28'
          }) as unknown as User
        }
      });

      const user = await getUser.execute(123);

      expect(user.id).to.equal(123);
      expect(user.firstName).to.equal('Patrick');
      expect(user.middleName).to.equal('Corpuz');
      expect(user.lastName).to.equal('Castro');
      expect(user.email).to.equal('patrickp.castro@gmail.com');
      expect(user.contactNumber).to.equal('+639155634242');
      expect(user.address).to.equal('Some address');
      expect(user.gender).to.equal('Male');
      expect(user.birthday).to.equal('1994-04-28');
    });
  });

  context('when user does not exist', () => {
    it('propagates the not-found error', async () => {
      const getUser = new GetUser({
        usersRepository: {
          getById: async () => {
            throw new NotFoundError('User with id 123 can\'t be found.');
          }
        }
      });

      try {
        await getUser.execute(123);
        expect.fail('should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect((err as NotFoundError).details).to.equal('User with id 123 can\'t be found.');
      }
    });
  });
});