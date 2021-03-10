const User = require('src/domain/user/User');

const SequelizeUserMapper = {
  toEntity({ dataValues }) {
    const { id, email, passwordHash, acceptTerms, firstName, middleName, lastName, contactNumber, address } = dataValues;

    return new User({ id, email, passwordHash, acceptTerms, firstName, middleName, lastName, contactNumber, address });

  },

  toDatabase(survivor) {
    const { email, passwordHash, acceptTerms, firstName, middleName, lastName, contactNumber, address } = survivor;

    return { email, passwordHash, acceptTerms, firstName, middleName, lastName, contactNumber, address };
  }
};

module.exports = SequelizeUserMapper;

