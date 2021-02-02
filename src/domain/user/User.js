const { attributes } = require('structure');

const User = attributes({
  userId: Number,
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: true,
    maxLength: 2
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    nullable: true
  },
  email: {
    type: String,
    email: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    nullable: true
  },
  birthDay: {
    type: Date,
    required: true
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