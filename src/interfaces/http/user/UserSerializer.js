const UserSerializer = {
  serialize({ id, firstName, middleName, lastName, gender, email, contactNumber, address, birthday }) {
    return {
      id,
      firstName,
      middleName,
      lastName,
      gender,
      email,
      contactNumber,
      address,
      birthday
    };
  }
};

module.exports = UserSerializer;