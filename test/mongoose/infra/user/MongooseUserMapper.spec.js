const { expect } = require('chai');
const User = require('src/domain/user/User');
const MongooseUserMapper = require('src/infra/user/MongooseUserMapper');

describe('Infra :: User :: MongooseUserMapper', () => {
  describe('.toEntity', () => {
    it('returns user instance with passed attributes', () => {
      const mockedMongooseUser = {
        dataValues: {
          _id: '5efec5f82516e36a501ceaaa',
          email: 'patrickp.castro@gmail.com',
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          contactNumber: '+639155634242',
        }
      };

      const entity = MongooseUserMapper.toEntity(mockedMongooseUser);

      expect(entity).to.be.instanceOf(User);
      expect(entity._id).to.equal('5efec5f82516e36a501ceaaa');
      expect(entity.email).to.equal('patrickp.castro@gmail.com');
      expect(entity.firstName).to.equal('Patrick');
      expect(entity.middleName).to.equal('Corpuz');
      expect(entity.lastName).to.equal('Castro');
      expect(entity.contactNumber).to.equal('+639155634242');
    });

  });

  describe('.toDatabase', () => {
    it('returns user object prepared to be persisted', () => {
      const user = new User({
        email: 'patrickp.castro@gmail.com',
        firstName: 'Patrick',
        middleName: 'Corpuz',
        lastName: 'Castro',
        contactNumber: '+639155634242',
      });

      const dbUser = MongooseUserMapper.toDatabase(user);

      expect(dbUser.firstName).to.equal('Patrick');
      expect(dbUser.middleName).to.equal('Corpuz');
      expect(dbUser.lastName).to.equal('Castro');
      expect(dbUser.email).to.equal('patrickp.castro@gmail.com');
      expect(dbUser.contactNumber).to.equal('+639155634242');
      expect(dbUser).to.have.all.keys('email', 'firstName', 'middleName', 'lastName', 'contactNumber', 'address');
    });

  });
  
});
