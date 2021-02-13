const { expect } = require('chai');
const GetUser = require('src/app/user/GetUser');

describe('App :: User :: GetUser', () => {
  let getUser;

  context('when user exists', () => {
    beforeEach(() => {
      const MockUsersRepository = {
        getById: (userId) => Promise.resolve({
          id: userId,
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242',
          address: 'Some address',
          gender: 'Male',
          birthday: '1994-04-28'

        })
      };

      getUser = new GetUser({
        usersRepository: MockUsersRepository
      });
    });

    it('emits SUCCESS and returns the user', (done) => {
      getUser.on(getUser.outputs.SUCCESS, (user) => {
        expect(user.id).to.equal(123);
        expect(user.firstName).to.equal('Patrick');
        expect(user.middleName).to.equal('Corpuz');
        expect(user.lastName).to.equal('Castro');
        expect(user.email).to.equal('patrickp.castro@gmail.com');
        expect(user.contactNumber).to.equal('+639155634242');
        expect(user.address).to.equal('Some address');
        expect(user.gender).to.equal('Male');
        expect(user.birthday).to.equal('1994-04-28');
        done();
      });

      getUser.execute(123);
    });
  });

});