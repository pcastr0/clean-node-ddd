const { attributes } = require('structure');

const User = attributes({
  id: Number,
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
  gender: {
    type: String,
    nullable: true
  },
  email: {
    type: String,
    email: true,
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
  birthDay: {
    type: Date,
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