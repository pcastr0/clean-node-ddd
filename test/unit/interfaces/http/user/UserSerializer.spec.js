const { expect } = require('chai');
const UserSerializer = require('src/interfaces/http/user/UserSerializer');
const User = require('src/domain/user/User');

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
      birthday: '1994-04-28'
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
      birthday: '1994-04-28'
    });

  });

  it('ignores extra attributes', () => {
    const serializedUser = UserSerializer.serialize({
      id: 1,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      email: 'patrickp.castro@gmail.com',
      contactNumber: '+639155634242',
      address: 'Some address',
      gender: 'Male',
      birthday: '1994-04-28',
      unknown: 'wasnt me!'
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
      birthday: '1994-04-28'
    });

  });

  it('is able to serialize user entity instances', () => {
    const user = new User({
      id: 1,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      email: 'patrickp.castro@gmail.com',
      contactNumber: '+639155634242',
      address: 'Some address',
      gender: 'Male',
      birthday: '1994-04-28'
    });

    const serializedUser = UserSerializer.serialize(user);

    expect(serializedUser).to.eql({
      id: 1,
      firstName: 'Patrick',
      middleName: 'Corpuz',
      lastName: 'Castro',
      email: 'patrickp.castro@gmail.com',
      contactNumber: '+639155634242',
      address: 'Some address',
      gender: 'Male',
      birthday: new Date('1994-04-28')
    });

  });

});