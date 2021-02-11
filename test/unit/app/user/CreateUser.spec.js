/* eslint-disable no-undef */
const { expect } = require('chai');
const CreateUser = require('src/app/user/CreateUser');

describe('App :: User :: CreateUser', () => {
  let createUser;

  context('when user is valid', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        add: (user) => Promise.resolve(user)
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });
    });

    it('creates the user and emits SUCCESS', () => {
      const userData = {
        firstName: 'Patrick',
        middleName: 'Corpuz',
        lastName: 'Castro',
        email: 'patrickp.castro@gmail.com',
        contactNumber: '+639155634242'
      };

      createUser.on(createUser.outputs.SUCCESS, (response) => {
        expect(response.firstName).to.equal('Patrick');
        expect(response.middleName).to.equal('Corpuz');
        expect(response.lastName).to.equal('Castro');
        expect(response.email).to.equal('patrickp.castro@gmail.com');
        expect(response.contactNumber).to.equal('+639155634242');
        done();
      });

      createUser.execute(userData);
    });

  });

  context('when user is invalid', () => {
    before(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(Error('ValidationError'))
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });

    });

    it('emits VALIDATION_ERROR with the error', (done) => {
      const userData = {
        firstName: 'Patrick',
        middleName: 'Corpuz',
        lastName: 'Castro',
        email: 'patrickp.castro@gmail.com',
        contactNumber: '+639155634242'
      };

      createUser.on(createUser.outputs.VALIDATION_ERROR, (response) => {
        expect(response.message).to.equal('ValidationError');
        done();
      });

      createUser.execute(userData);
    });

  });

  context('when ther is an internal error', () => {
    before(() => {
      const MockUsersRepository = {
        add: () => Promise.reject(new Error('Some Error'))
      };

      createUser = new CreateUser({
        usersRepository: MockUsersRepository
      });

      it('emits ERROR with the error', () => {
        const userData = {
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242'
        };

        createUser.on(createUser.outputs.ERROR, (response) => {
          expect(response.message).to.equal('Some Error');
          done();
        });

        createUser.execute(userData);
      });
    });
    
  });

});