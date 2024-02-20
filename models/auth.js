const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    contact: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpiration: { type: Date },
 });

module.exports = mongoose.model('UserLogin', loginSchema);
