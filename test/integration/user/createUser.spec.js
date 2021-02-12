const request = require('test/utils/request');
const { expect } = require('chai');

describe('API :: POST /api/users', () => {
  context('when set data is valid', () => {
    it('creates and returns 201 and the new user', async () => {
      const { body } = await request()
        .post('/api/users')
        .send({
          firstName: 'Patrick',
          middleName: 'Corpuz',
          lastName: 'Castro',
          email: 'patrickp.castro@gmail.com',
          contactNumber: '+639155634242',
        })
        .expect(201);

      expect(body.id).to.exist;
      expect(body.firstName).to.equal('Patrick');
      expect(body.middleName).to.equal('Corpuz');
      expect(body.lastName).to.equal('Castro');
      expect(body.email).to.equal('patrickp.castro@gmail.com');
      expect(body.contactNumber).to.equal('+639155634242');
      expect(body).to.have.all.keys('id', 'firstName', 'middleName', 'lastName', 'email', 'contactNumber');
    });

  });

  context('when sent data is invalid', () => {
    it('does not create and returns 400 with validation error', async () => {
      const { body } = await request()
        .post('/api/users')
        .expect(400);

      expect(body.type).to.equal('ValidationError');
      expect(body.details).to.have.lengthOf(5);
      expect(body.details[0].message).to.equal('"firstName" is required');
      expect(body.details[1].message).to.equal('"middleName" is required');
      expect(body.details[2].message).to.equal('"lastName" is required');
      expect(body.details[3].message).to.equal('"email" is required');
      expect(body.details[4].message).to.equal('"contactNumber" is required');
    });
  });

});