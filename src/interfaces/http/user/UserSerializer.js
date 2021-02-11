const UserSerializer = {
  serialize({ id, firstName, middleName, lastName, gender, email, contactNumber, address, birthDay }) {
    return {
      id,
      firstName,
      middleName,
      lastName,
      gender,
      email,
      contactNumber,
      address,
      birthDay
    };
  }
};

module.exports = UserSerializer;