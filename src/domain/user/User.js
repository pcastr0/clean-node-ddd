const { attributes } = require('structure');

const User = attributes({
  id: Number,
  email: {
    type: String,
    email: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
  acceptTerms: {
    type: Boolean,
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
  }
})(class User {
  isLegal() {
    return this.age >= User.MIN_LEGAL_AGE;
  }
});

User.MIN_LEGAL_AGE = 21;

module.exports = User;