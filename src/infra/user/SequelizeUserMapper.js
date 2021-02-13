const User = require('src/domain/user/User');

const SequelizeUserMapper = {
  toEntity({ dataValues }) {
    const { id, firstName, middleName, lastName, gender, email, contactNumber, address, birthday } = dataValues;

    return new User({ id, firstName, middleName, lastName, gender, email, contactNumber, address, birthday });

  },

  toDatabase(survivor) {
    const { firstName, middleName, lastName, gender, email, contactNumber, address, birthday } = survivor;

    return { firstName, middleName, lastName, gender, email, contactNumber, address, birthday };
  }
};

module.exports = SequelizeUserMapper;

