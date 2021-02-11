const { expect } = require('chai');
const UserSerializer = require('src/interfaces/http/user/UserSerializer');

describe('Interfaces :: HTTP :: User :: UserSerializer', () => {
  it('returns attributes of user', () => {
    const serializedUser = UserSerializer.serialize({
      id: 1,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      email: 'patrickp.castro@gmail.com',
      contactNumber: '+639155634242',
      address: 'Some address',
      gender: 'Male',
      birthDay: Date.now()
    });

    expect(serializedUser).to.eql({
      id: 1,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      email: 'patrickp.castro@gmail.com',
      contactNumber: '+639155634242',
      address: 'Some address',
      gender: 'Male',
      birthDay: Date.now()
    });
  });
});