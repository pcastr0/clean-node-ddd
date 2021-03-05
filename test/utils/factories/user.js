const dataFaker = require('src/infra/utils/dataFaker');

module.exports = (factory, { User }) => {
  factory.define('user', User, {
    email: dataFaker.email(),
    firstName: dataFaker.first(),
    middleName: dataFaker.last(),
    lastName: dataFaker.last(),
    contactNumber: dataFaker.phone(),
  });
};