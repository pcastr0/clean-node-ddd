const { expect } = require('chai');
const User = require('src/domain/user/User');
const SequelizeUserMapper = require('src/infra/user/SequelizeUserMapper');

describe('Infra :: User :: SequelizeUserMapper', () => {
  describe('.toEntity', () => {
    it('returns user instance with passed attributes', () => {
      const mockedSequelizeUser = {
        dataValues: {
          userId: 1,
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          // gender: 'M',
          // email: 'patrickp.castro@gmail.com',
          // contactNumber: '+639155634242',
          // address: 'Baguio City, Benguet, Philippines',
          // birthDay: Date.now(),
          // age: 26
        }
      };

      const entity = SequelizeUserMapper.toEntity(mockedSequelizeUser);

      expect(entity).to.be.instanceOf(User);
      // expect(entity.userId).to.equal(1);
      // expect(entity.firstName).to.equal('Patrick');

    });

    describe('.toDatabase', () => {
      it('returns user object prepared to be persisted', () => {
        
      });
    });
  });
});
