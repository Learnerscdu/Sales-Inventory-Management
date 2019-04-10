
const mongoose = require('mongoose');
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

mongoose.Promise = Promise;


const EmployeeSchema = new Schema ({
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true, 
      index: { unique: true, dropDups: true }
    },
    password: {
      type: String,
      required: true
    },
    manager_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    update_on:{
      type:Date
    },
    created_on:{
      type:Date,
      default:Date.now()
    }
  }, {timestamps: true});

const Employees = module.exports = mongoose.model('Employees', EmployeeSchema);

module.exports.getUserById = function(id, callback) {
  Employees.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  const query = {email: username}
  Employees.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      console.log(err);
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}