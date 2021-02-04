const User = require('src/domain/user/User');

const SequelizeUserMapper = {
  toEntity({ dataValues }) {
    const { id, firstName, middleName, lastName, gender, email, contactNumber, address, birthDay, age } = dataValues;

    return new User({ id, firstName, middleName, lastName, gender, email, contactNumber, address, birthDay, age });

  },

  toDatabase(survivor) {
    const { firstName, middleName, lastName, gender, email, contactNumber, address, birthDay } = survivor;

    return { firstName, middleName, lastName, gender, email, contactNumber, address, birthDay };
  }
};

module.exports = SequelizeUserMapper;

