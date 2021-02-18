const request = require('test/utils/request');
const factory = require('test/utils/factory');
const { expect } = require('chai');

describe('API :: PUT /api/users/:id', () => {
  context('when user exist', () => {
    context('when sent data is ok', () => {
      it('updates user and returns 202 with the updated user', async () => {
        const user = await factory.create('user', {
          firstName: 'Patrick'
        });

        const { body } = await request()
          .put(`/api/users/${user.id}`)
          .send({
            firstName: 'Paul'
          })
          .expect(202);

        expect(body.id).to.equal(user.id);
        expect(body.firstName).to.equal('Paul');

      });

    });

    context('when data is not valid', () => {
      it('does not update user and returns 400 validation error', async () => {
        const user = await factory.create('user', {
          firstName: 'Patrick'
        });

        const { body } = await request()
          .put(`/api/users/${user.id}`)
          .send({
            firstName: ''
          })
          .expect(400);

        expect(body.type).to.equal('ValidationError');
        expect(body.details).to.have.lengthOf(1);
        expect(body.details[0].message).to.equal('"firstName" is not allowed to be empty');
      });

    });

  });

  context('when user does not exist', () => {
    it('returns not found error with satus 404', async () => {
      const { body } = await request()
        .put('/api/users/187')
        .send({
          firstName: 'Paul'
        })
        .expect(404);

      expect(body.type).to.equal('NotFoundError');
      expect(body.details).to.equal('User with id 187 can\'t be found.');
    });

  });

});