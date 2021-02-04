const { expect } = require('chai');
const User = require('src/domain/user/User');
const SequelizeUserMapper = require('src/infra/user/SequelizeUserMapper');

describe('Infra :: User :: SequelizeUserMapper', () => {
  describe('.toEntity', () => {
    it('returns user instance with passed attributes', () => {
      const mockedSequelizeUser = {
        dataValues: {
          id: 1,
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242',
        }
      };

      const entity = SequelizeUserMapper.toEntity(mockedSequelizeUser);

      expect(entity).to.be.instanceOf(User);
      expect(entity.id).to.equal(1);
      expect(entity.firstName).to.equal('Patrick');
      expect(entity.middleName).to.equal('Corpuz');
      expect(entity.lastName).to.equal('Castro');
      expect(entity.email).to.equal('patrickp.castro@gmail.com');
      expect(entity.contactNumber).to.equal('+639155634242');
    });

    describe('.toDatabase', () => {
      it('returns user object prepared to be persisted', () => {
        const user = new User({
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242',
        });

        const dbUser = SequelizeUserMapper.toDatabase(user);

        expect(dbUser.firstName).to.equal('Patrick');
        expect(dbUser.middleName).to.equal('Corpuz');
        expect(dbUser.lastName).to.equal('Castro');
        expect(dbUser.email).to.equal('patrickp.castro@gmail.com');
        expect(dbUser.contactNumber).to.equal('+639155634242');
        expect(dbUser).to.have.all.keys('firstName', 'middleName', 'lastName', 'gender', 'email', 'address', 'contactNumber', 'birthDay');
      });
    });
  });
});
