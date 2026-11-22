import { expect } from 'chai';
import { UserSerializer } from '../../../../../src/interfaces/http/user/UserSerializer';
import { User, type UserData } from '../../../../../src/domain/user/User';

const attributes: UserData = {
  id: 1,
  firstName: 'Patrick',
  middleName: 'Corpuz',
  lastName: 'Castro',
  email: 'patrickp.castro@gmail.com',
  contactNumber: '+639155634242',
  address: 'Some address',
  gender: 'Male',
  // The entity converts birthday strings to Date on construction, so the
  // serialized form is always a Date instance.
  birthday: new Date('1994-04-28')
};

describe('Interfaces :: HTTP :: User :: UserSerializer', () => {
  it('returns the attributes of the user', () => {
    const serializedUser = UserSerializer.serialize(new User(attributes));

    expect(serializedUser).to.eql(attributes);
  });

  it('ignores extra attributes', () => {
    const serializedUser = UserSerializer.serialize({
      ...attributes,
      unknown: 'wasnt me!'
    } as unknown as User);

    expect(serializedUser).to.eql(attributes);
  });

  it('converts birthday strings to Date instances', () => {
    const serializedUser = UserSerializer.serialize(new User(attributes));

    expect(serializedUser.birthday).to.be.instanceOf(Date);
    expect((serializedUser.birthday as Date).toISOString()).to.equal(new Date('1994-04-28').toISOString());
  });
});