const { attributes } = require('structure');

const User = attributes({
  _id: String,
  email: {
    type: String,
    email: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    nullable: true
  },
  age: {
    type: Number
  }
})(class User {
  isLegal() {
    return this.age >= User.MIN_LEGAL_AGE;
  }
});

User.MIN_LEGAL_AGE = 21;

module.exports = User;