const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: { type: String, unique: true, require: true },
  // passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: String,
  // verificationToken: String,
  // verified: Date,
  // resetToken: {
  //   token: String,
  //   expires: Date
  // },
  // passwordReset: Date,
  created: { type: Date, default: Date.now },
  updated: Date,
});

module.exports = mongoose.model('User', schema);