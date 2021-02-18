const request = require('test/utils/request');
const factory = require('test/utils/factory');
const { expect } = require('chai');

describe('API :: DELETE /api/users/:id', () => {
  context('when user exists', () => {
    it('delete the user and returns status 202', async () => {
      const user = await factory.create('user', {
        firstName: 'User'
      });

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