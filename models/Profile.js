// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  headline: String,
  location: String,
  // Add other fields as needed
});

module.exports = mongoose.model('Profile', profileSchema);