const User = require('src/domain/user/User');

const SequelizeUserMapper = {
  toEntity({ dataValues }) {
    const { userId, firstName, middleName, lastName, gender, email, contactNumber, address, birthday, age } = dataValues;

    return new User({ userId, firstName, middleName, lastName, gender, email, contactNumber, address, birthday, age });

  },

  toDatabase(survivor) {
    const { userId, firstName, middleName, lastName, gender, email, contactNumber, address, birthday, age } = survivor;

    return { userId, firstName, middleName, lastName, gender, email, contactNumber, address, birthday, age };
  }
};

module.exports = SequelizeUserMapper;

