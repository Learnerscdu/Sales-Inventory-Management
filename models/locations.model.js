const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
var Schema = mongoose.Schema;

const LocationSchema = mongoose.Schema({
    name: String
  }, {timestamps: true})

module.exports = mongoose.model('locations', LocationSchema);