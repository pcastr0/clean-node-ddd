import { expect } from 'chai';
import { User } from '../../../../src/domain/user/User';

describe('Domain :: User', () => {
  describe('#validate', () => {
    context('when required fields are missing', () => {
      it('reports each missing field in declaration order', () => {
        const { valid, errors } = new User().validate();

        expect(valid).to.be.false;
        expect(errors).to.eql([
          { message: '"firstName" is required', path: ['firstName'] },
          { message: '"middleName" is required', path: ['middleName'] },
          { message: '"lastName" is required', path: ['lastName'] },
          { message: '"email" is required', path: ['email'] },
          { message: '"contactNumber" is required', path: ['contactNumber'] }
        ]);
      });
    });

    context('when a required field is an empty string', () => {
      it('reports the field as empty', () => {
        const { valid, errors } = new User({
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: ''
        }).validate();

        expect(valid).to.be.false;
        expect(errors).to.eql([
          { message: '"contactNumber" is not allowed to be empty', path: ['contactNumber'] }
        ]);
      });
    });

    context('when the email is not a valid email', () => {
      it('reports the email as invalid', () => {
        const { valid, errors } = new User({
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'not-an-email',
          contactNumber: '+639155634242'
        }).validate();

        expect(valid).to.be.false;
        expect(errors).to.eql([
          { message: '"email" must be a valid email', path: ['email'] }
        ]);
      });
    });

    context('when the birthday cannot be parsed', () => {
      it('reports the birthday as invalid', () => {
        const { valid, errors } = new User({
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242',
          birthday: 'not-a-date'
        }).validate();

        expect(valid).to.be.false;
        expect(errors).to.eql([
          { message: '"birthday" must be a valid date', path: ['birthday'] }
        ]);
      });
    });

    context('when the user is valid', () => {
      it('reports no errors', () => {
        const { valid, errors } = new User({
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242',
          gender: 'Male',
          address: 'Some address',
          birthday: '1994-04-28'
        }).validate();

        expect(valid).to.be.true;
        expect(errors).to.eql([]);
      });
    });
  });

  describe('#birthday', () => {
    it('converts parseable strings to Date instances', () => {
      const user = new User({ birthday: '1994-04-28' });

      expect(user.birthday).to.be.instanceOf(Date);
    });
  });
});