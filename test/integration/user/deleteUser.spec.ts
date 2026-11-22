import request from '../../utils/request';
import factory from '../../utils/factory';
import { expect } from 'chai';

describe('API :: DELETE /api/users/:id', () => {
  context('when user exists', () => {
    it('deletes the user and returns status 202', async () => {
      const user = await factory.create({ firstName: 'User' });

      await request()
        .delete(`/api/users/${user.id}`)
        .expect(202);
    });
  });

  context('when user does not exist', () => {
    it('returns not found error with status 404', async () => {
      const { body } = await request()
        .delete('/api/users/187')
        .expect(404);

      expect(body.type).to.equal('NotFoundError');
      expect(body.details).to.equal('User with id 187 can\'t be found.');
    });
  });
});