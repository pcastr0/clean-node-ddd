import request from '../../utils/request';
import factory from '../../utils/factory';
import { expect } from 'chai';

describe('API :: GET /api/users/:id', () => {
  context('when user exists', () => {
    it('returns the user and status 200', async () => {
      const user = await factory.create({
        firstName: 'Patrick',
        middleName: 'Corpuz',
        lastName: 'Castro',
        email: 'patrickp.castro@gmail.com',
        contactNumber: '+639155634242'
      });

      const { body } = await request()
        .get(`/api/users/${user.id}`)
        .expect(200);

      expect(body.id).to.equal(user.id);
      expect(body.firstName).to.equal('Patrick');
      expect(body.middleName).to.equal('Corpuz');
      expect(body.lastName).to.equal('Castro');
      expect(body.email).to.equal('patrickp.castro@gmail.com');
      expect(body.contactNumber).to.equal('+639155634242');
    });
  });

  context('when user does not exist', () => {
    it('returns not found error and status 404', async () => {
      const { body } = await request()
        .get('/api/users/123')
        .expect(404);

      expect(body.type).to.equal('NotFoundError');
      expect(body.details).to.equal('User with id 123 can\'t be found.');
    });
  });
});