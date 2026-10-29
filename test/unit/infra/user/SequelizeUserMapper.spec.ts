import { expect } from 'chai';
import { UserMapper } from '../../../../src/infra/user/SequelizeUserMapper';
import { User } from '../../../../src/domain/user/User';
import type { UserAttributes } from '../../../../src/infra/database/models/user';

describe('Infra :: User :: UserMapper', () => {
  describe('.toEntity', () => {
    it('returns a user instance with the passed attributes', () => {
      const dataValues: UserAttributes = {
        id: 1,
        firstName: 'Patrick',
        middleName: 'Corpuz',
        lastName: 'Castro',
        email: 'patrickp.castro@gmail.com',
        contactNumber: '+639155634242',
        gender: null,
        address: null,
        birthday: null
      };

      const entity = UserMapper.toEntity({ dataValues });

      expect(entity).to.be.instanceOf(User);
      expect(entity.id).to.equal(1);
      expect(entity.firstName).to.equal('Patrick');
      expect(entity.middleName).to.equal('Corpuz');
      expect(entity.lastName).to.equal('Castro');
      expect(entity.email).to.equal('patrickp.castro@gmail.com');
      expect(entity.contactNumber).to.equal('+639155634242');
    });
  });

  describe('.toDatabase', () => {
    it('returns a user object prepared to be persisted', () => {
      const user = new User({
        firstName: 'Patrick',
        middleName: 'Corpuz',
        lastName: 'Castro',
        email: 'patrickp.castro@gmail.com',
        contactNumber: '+639155634242'
      });

      const dbUser = UserMapper.toDatabase(user);

      expect(dbUser.firstName).to.equal('Patrick');
      expect(dbUser.middleName).to.equal('Corpuz');
      expect(dbUser.lastName).to.equal('Castro');
      expect(dbUser.email).to.equal('patrickp.castro@gmail.com');
      expect(dbUser.contactNumber).to.equal('+639155634242');
      expect(dbUser).to.have.all.keys('firstName', 'middleName', 'lastName', 'gender', 'email', 'address', 'contactNumber', 'birthday');
    });
  });
});