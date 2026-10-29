import request from '../../utils/request';
import factory from '../../utils/factory';
import { expect } from 'chai';

describe('API :: GET /api/users', () => {
  context('when there are users', () => {
    beforeEach(() => {
      return factory.createMany(2, [
        {
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242'
        },
        {
          firstName: 'Paul',
          middleName: 'Salas',
          lastName: 'Castro',
          email: 'patrickcastro4.20@gmail.com',
          contactNumber: '+639123456789'
        }
      ]);
    });

    it('returns success with array of users', async () => {
      const { body } = await request()
        .get('/api/users')
        .expect(200);

      expect(body).to.have.lengthOf(2);

      expect(body[0].firstName).to.equal('Patrick');
      expect(body[0].middleName).to.equal('Corpuz');
      expect(body[0].lastName).to.equal('Castro');
      expect(body[0].email).to.equal('patrickp.castro@gmail.com');
      expect(body[0].contactNumber).to.equal('+639155634242');

      expect(body[1].firstName).to.equal('Paul');
      expect(body[1].middleName).to.equal('Salas');
      expect(body[1].lastName).to.equal('Castro');
      expect(body[1].email).to.equal('patrickcastro4.20@gmail.com');
      expect(body[1].contactNumber).to.equal('+639123456789');

      expect(body[0]).to.have.all.keys('id', 'firstName', 'middleName', 'lastName', 'gender', 'email', 'contactNumber', 'address', 'birthday');
      expect(body[1]).to.have.all.keys('id', 'firstName', 'middleName', 'lastName', 'gender', 'email', 'contactNumber', 'address', 'birthday');
    });
  });

  context('when there are no users', () => {
    it('returns success with empty array', async () => {
      const { body } = await request()
        .get('/api/users')
        .expect(200);

      expect(body).to.have.lengthOf(0);
    });
  });
});