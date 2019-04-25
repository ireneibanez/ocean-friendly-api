'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
  name: {type: String, required: false, trim: true},
  email: {type: String, required: true, trim: true},
  password: {type: String, required: true, trim: true},
  salt: {type: String, required: false, trim: true},
  role: {type: String, required: false, default: 'USER'},
  createdAt: {type: Date, required: true, default: Date.now}
});

User.index({ email: 1 });

module.exports = mongoose.model('User', User);
