const { expect } = require('chai');
const factory = require('test/utils/factory');
const SequelizeUsersRepository = require('src/infra/user/SequelizeUsersRepository');
const User = require('src/domain/user/User');
const { user: UserModel } = require('src/infra/database/models');


describe('Infra :: User :: SequelizeUsersRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new SequelizeUsersRepository({ UserModel });
  });

  describe('#getAll', () => {
    beforeEach(() => {
      return factory.createMany('user', 2, [
        {
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242'
        },
        {
          firstName: 'Paul',
          middleName: 'Supangan',
          lastName: 'Corpuz',
          email: 'patrickcastro4.20@gmail.com',
          contactNumber: '+639123456789'
        },
      ]);
    });

    it('returns all users from the database', async () => {
      const users = await repository.getAll();

      expect(users).to.have.lengthOf(2);

      expect(users[0]).to.be.instanceOf(User);
      expect(users[0].firstName).to.be.equal('Patrick');
      expect(users[0].middleName).to.be.equal('Corpuz');
      expect(users[0].lastName).to.be.equal('Castro');
      expect(users[0].email).to.be.equal('patrickp.castro@gmail.com');
      expect(users[0].contactNumber).to.be.equal('+639155634242');

      expect(users[1]).to.be.instanceOf(User);
      expect(users[1].firstName).to.be.equal('Paul');
      expect(users[1].middleName).to.be.equal('Supangan');
      expect(users[1].lastName).to.be.equal('Corpuz');
      expect(users[1].email).to.be.equal('patrickcastro4.20@gmail.com');
      expect(users[1].contactNumber).to.be.equal('+639123456789');

    });

  });

  describe('#getById', () => {
    context('when user exists', () => {
      it('returns the user', async () => {
        const user = await factory.create('user', {
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242'
        });

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
      it('reject with an error', async () => {
        try {
          await repository.getById(0);
        } catch (error) {
          expect(error.message).to.equal('NotFoundError');
          expect(error.details).to.equal('User with id 0 can\'t be found.');
        }
      });
    });
  });

  describe('#add', () => {
    context('when the user is valid', () => {
      it('persist the user', () => {
        const user = new User({
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242'
        });

        expect(user.validate().valid).to.be.ok();

        return expect(async () => {
          const persistedUser = await repository.add(user);

          expect(persistedUser.id).to.exist;
          expect(persistedUser.firstName).to.equal(user.firstName);
          expect(persistedUser.middleName).to.equal(user.middleName);
          expect(persistedUser.lastName).to.equal(user.lastName);
          expect(persistedUser.email).to.equal(user.email);
          expect(persistedUser.contactNumber).to.equal(user.contactNumber);
        }).to.alter(() => repository.count(), { by: 1 });
      });
    });

    context('when user is invalid', () => {
      it('does not persist the user and reject with an error', () => {
        const user = new User();

        expect(user.validate().valid).to.not.be.ok();

        return expect(async () => {
          try {
            await repository.add(user);
          } catch (error) {
            expect(error.message).to.equal('ValidationError');
            expect(error.details).to.eql([
              { message: '"firstName" is required', path: ['firstName'] },
              { message: '"middleName" is required', path: ['middleName'] },
              { message: '"lastName" is required', path: ['lastName'] },
              { message: '"email" is required', path: ['email'] },
              { message: '"contactNumber" is required', path: ['contactNumber'] }
            ]);
          }
        }).to.not.alter(() => repository.count());
      });
    });

  });

  describe('#update', () => {
    context('when the user exists', () => {
      context('when data is valid', () => {
        it('updates and returns the updated user', async () => {

        });
      });

      context('when data is not valid', () => {
        it('does not update and returns the error', async () => {

        });
      });
    });

    context('when the user does not exist', () => {
      it('returns an error', async () => {

      });
    });

  });

  describe('#remove', () => {
    context('when the user exists', () => {
      it('removes the user', () => {

      });
    });

    context('when the user does not exist', () => {
      it('returns an error', () => {

      });
    });
  });

});
