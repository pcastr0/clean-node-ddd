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

      });
    });

    context('when user does not exist', () => {
      it('reject with an error', async () => {

      });
    });
  });

  describe('#add', () => {
    context('when the user is valid', () => {
      it('persist the user', () => {

      });
    });

    context('when user is invalid', () => {
      it('does not persist the user and reject with an error', () => {

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
