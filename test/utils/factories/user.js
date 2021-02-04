const dataFaker = require('src/infra/utils/dataFaker');

module.exports = (factory, { user }) => {
  console.log('Define Factory for User');
  console.log(typeof user);
  console.log(user);
  factory.define('user', user, {
    firstName: dataFaker.first(),
    middleName: dataFaker.last(),
    lastName: dataFaker.last(),
    email: dataFaker.email(),
    contactNumber: dataFaker.phone(),
  });
};