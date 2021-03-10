const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, require: true },
  // passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  // acceptTerms: { type: Boolean, required: true },
  address: String,
  // role: { type: String, required: true },
  // verificationToken: String,
  // verified: Date,
  // resetToken: {
  //   token: String,
  //   expires: Date
  // },
  // passwordReset: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

