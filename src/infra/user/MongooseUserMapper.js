const User = require('src/domain/user/User');

const MongooseUserMapper = {
  toEntity({ dataValues }) {
    const { _id, email, firstName, middleName, lastName, contactNumber, address } = dataValues;

    return new User({ _id, email, firstName, middleName, lastName, contactNumber, address });

  },

  toDatabase(survivor) {
    const { email, firstName, middleName, lastName, contactNumber, address } = survivor;

    return { email, firstName, middleName, lastName, contactNumber, address };
  }
};

module.exports = MongooseUserMapper;

