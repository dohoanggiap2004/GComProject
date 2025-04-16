const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  dob: {
    type: Date,
  },
  service: {
    type: String,
    enum: ['standard', 'premium'],
    default: 'standard',
    required: true,
  },
  serviceExpiry: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
