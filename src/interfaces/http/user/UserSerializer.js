const UserSerializer = {
  serialize({ id, email, passwordHash, acceptTerms, firstName, middleName, lastName, contactNumber, address }) {
    return {
      id,
      email,
      passwordHash,
      acceptTerms,
      firstName,
      middleName,
      lastName,
      contactNumber,
      address
    };
  }
};

module.exports = UserSerializer;