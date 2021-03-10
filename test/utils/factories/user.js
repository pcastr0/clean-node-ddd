const dataFaker = require('src/infra/utils/dataFaker');

module.exports = (factory, { user }) => {
  factory.define('user', user, {
    email: dataFaker.email(),
    passwordHash: dataFaker.word(),
    acceptTerms: false,
    firstName: dataFaker.first(),
    middleName: dataFaker.last(),
    lastName: dataFaker.last(),
    contactNumber: dataFaker.phone(),
  });
};