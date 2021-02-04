const { expect } = require('chai');
const User = require('src/domain/user/User');

// This is just a sample unit test
// We can write a sensible tests based on a use case later on
describe('Domain :: User', () => {
  describe('#isLegal', () => {
    context('when user is younger than 21', () => {
      it('returns false', () => {
        const user = new User({ age: 20 });

        expect(user.isLegal()).to.be.false();
      });
    });

    context('when user is in legal age', () => {
      it('returns true', () => {
        const user = new User({ age: 26 });

        expect(user.isLegal()).to.be.true();
      });
    });
  });
});