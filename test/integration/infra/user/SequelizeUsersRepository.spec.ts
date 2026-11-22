import { expect } from 'chai';
import factory from '../../../utils/factory';
import { SequelizeUsersRepository } from '../../../../src/infra/user/SequelizeUsersRepository';
import { User } from '../../../../src/domain/user/User';
import { ValidationError } from '../../../../src/domain/errors/ValidationError';
import { NotFoundError } from '../../../../src/domain/errors/NotFoundError';
import { user as UserModel } from '../../../../src/infra/database/models';

const validUserData = {
  firstName: 'Patrick',
  middleName: 'Corpuz',
  lastName: 'Castro',
  email: 'patrickp.castro@gmail.com',
  contactNumber: '+639155634242'
};

describe('Infra :: User :: SequelizeUsersRepository', () => {
  let repository: SequelizeUsersRepository;

  beforeEach(() => {
    repository = new SequelizeUsersRepository({ UserModel });
  });

  describe('#getAll', () => {
    beforeEach(() => {
      return factory.createMany(2, [
        validUserData,
        {
          firstName: 'Paul',
          middleName: 'Supangan',
          lastName: 'Corpuz',
          email: 'patrickcastro4.20@gmail.com',
          contactNumber: '+639123456789'
        }
      ]);
    });

    it('returns all users from the database', async () => {
      const users = await repository.getAll();

      expect(users).to.have.lengthOf(2);

      expect(users[0]).to.be.instanceOf(User);
      expect(users[0].firstName).to.equal('Patrick');
      expect(users[0].middleName).to.equal('Corpuz');
      expect(users[0].lastName).to.equal('Castro');
      expect(users[0].email).to.equal('patrickp.castro@gmail.com');
      expect(users[0].contactNumber).to.equal('+639155634242');

      expect(users[1]).to.be.instanceOf(User);
      expect(users[1].firstName).to.equal('Paul');
      expect(users[1].middleName).to.equal('Supangan');
      expect(users[1].lastName).to.equal('Corpuz');
      expect(users[1].email).to.equal('patrickcastro4.20@gmail.com');
      expect(users[1].contactNumber).to.equal('+639123456789');
    });
  });

  describe('#getById', () => {
    context('when user exists', () => {
      it('returns the user', async () => {
        const user = await factory.create(validUserData);

        const foundUser = await repository.getById(user.id);

        expect(foundUser).to.be.instanceOf(User);
        expect(foundUser.id).to.equal(user.id);
        expect(foundUser.firstName).to.equal(user.firstName);
        expect(foundUser.middleName).to.equal(user.middleName);
        expect(foundUser.lastName).to.equal(user.lastName);
        expect(foundUser.email).to.equal(user.email);
        expect(foundUser.contactNumber).to.equal(user.contactNumber);
      });
    });

    context('when user does not exist', () => {
      it('rejects with NotFoundError', async () => {
        try {
          await repository.getById(0);
          expect.fail('should have thrown');
        } catch (err) {
          expect(err).to.be.instanceOf(NotFoundError);
          expect((err as NotFoundError).details).to.equal('User with id 0 can\'t be found.');
        }
      });
    });
  });

  describe('#add', () => {
    context('when the user is valid', () => {
      it('persists the user', async () => {
        const user = new User(validUserData);

        expect(user.validate().valid).to.be.true;

        const countBefore = await repository.count();
        const persistedUser = await repository.add(user);
        const countAfter = await repository.count();

        expect(countAfter - countBefore).to.equal(1);

        expect(persistedUser.id).to.exist;
        expect(persistedUser.firstName).to.equal(user.firstName);
        expect(persistedUser.middleName).to.equal(user.middleName);
        expect(persistedUser.lastName).to.equal(user.lastName);
        expect(persistedUser.email).to.equal(user.email);
        expect(persistedUser.contactNumber).to.equal(user.contactNumber);
      });
    });

    context('when user is invalid', () => {
      it('does not persist the user and rejects with ValidationError', async () => {
        const user = new User();

        expect(user.validate().valid).to.be.false;

        const countBefore = await repository.count();

        try {
          await repository.add(user);
          expect.fail('should have thrown');
        } catch (err) {
          expect(err).to.be.instanceOf(ValidationError);
          expect((err as ValidationError).details).to.eql([
            { message: '"firstName" is required', path: ['firstName'] },
            { message: '"middleName" is required', path: ['middleName'] },
            { message: '"lastName" is required', path: ['lastName'] },
            { message: '"email" is required', path: ['email'] },
            { message: '"contactNumber" is required', path: ['contactNumber'] }
          ]);
        }

        expect(await repository.count()).to.equal(countBefore);
      });
    });
  });

  describe('#update', () => {
    context('when user exists', () => {
      context('when data is valid', () => {
        it('updates and returns the updated user', async () => {
          const user = await factory.create(validUserData);

          const updatedUser = await repository.update(user.id, { email: 'patrickcastro4.20@gmail.com' });

          expect(updatedUser.email).to.equal('patrickcastro4.20@gmail.com');

          const dbUser = await UserModel.findByPk(user.id);
          expect(dbUser?.email).to.equal('patrickcastro4.20@gmail.com');
        });
      });

      context('when data is not valid', () => {
        it('does not update and rejects with ValidationError', async () => {
          const user = await factory.create(validUserData);

          try {
            await repository.update(user.id, { email: '' });
            expect.fail('should have thrown');
          } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
          }

          const dbUser = await UserModel.findByPk(user.id);
          expect(dbUser?.email).to.equal('patrickp.castro@gmail.com');
        });
      });
    });

    context('when the user does not exist', () => {
      it('rejects with NotFoundError', async () => {
        try {
          await repository.update(0, { email: 'patrickcastro4.20@gmail.com' });
          expect.fail('should have thrown');
        } catch (err) {
          expect(err).to.be.instanceOf(NotFoundError);
          expect((err as NotFoundError).details).to.equal('User with id 0 can\'t be found.');
        }
      });
    });
  });

  describe('#remove', () => {
    context('when the user exists', () => {
      it('removes the user', async () => {
        const user = await factory.create(validUserData);

        const countBefore = await repository.count();
        await repository.remove(user.id);
        const countAfter = await repository.count();

        expect(countBefore - countAfter).to.equal(1);
      });
    });

    context('when the user does not exist', () => {
      it('rejects with NotFoundError', async () => {
        try {
          await repository.remove(0);
          expect.fail('should have thrown');
        } catch (err) {
          expect(err).to.be.instanceOf(NotFoundError);
        }
      });
    });
  });
});