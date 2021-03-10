const { expect } = require('chai');
const UserSerializer = require('src/interfaces/http/user/UserSerializer');
const User = require('src/domain/user/User');

describe('Interfaces :: HTTP :: User :: UserSerializer', () => {
  it('returns attributes of user', () => {
    const serializedUser = UserSerializer.serialize({
      id: 1,
      email: 'patrickp.castro@gmail.com',
      passwordHash: 'password',
      acceptTerms: true,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      contactNumber: '+639155634242',
      address: 'Some address',
    });

    expect(serializedUser).to.eql({
      id: 1,
      email: 'patrickp.castro@gmail.com',
      passwordHash: 'password',
      acceptTerms: true,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      contactNumber: '+639155634242',
      address: 'Some address',
    });

  });

  it('ignores extra attributes', () => {
    const serializedUser = UserSerializer.serialize({
      id: 1,
      email: 'patrickp.castro@gmail.com',
      passwordHash: 'password',
      acceptTerms: true,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      contactNumber: '+639155634242',
      address: 'Some address',
      unknown: 'wasnt me!'
    });

    expect(serializedUser).to.eql({
      id: 1,
      email: 'patrickp.castro@gmail.com',
      passwordHash: 'password',
      acceptTerms: true,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      contactNumber: '+639155634242',
      address: 'Some address',
    });

  });

  it('is able to serialize user entity instances', () => {
    const user = new User({
      id: 1,
      email: 'patrickp.castro@gmail.com',
      passwordHash: 'password',
      acceptTerms: true,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      contactNumber: '+639155634242',
      address: 'Some address',
    });

    const serializedUser = UserSerializer.serialize(user);

    expect(serializedUser).to.eql({
      id: 1,
      email: 'patrickp.castro@gmail.com',
      passwordHash: 'password',
      acceptTerms: true,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      contactNumber: '+639155634242',
      address: 'Some address',
    });

  });

});