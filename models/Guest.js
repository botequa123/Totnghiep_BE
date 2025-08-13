const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: String,
  phone: String,
  attending: Boolean,
  guests: Number,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
