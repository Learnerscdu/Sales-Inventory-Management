const Employee = require('../models/employees.model');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const createEmployee = (data) => {
  data.password = bcrypt.hashSync(data.password, salt);
  return Employee.create(data);   
}

const getEmployees = (data) => {
  return Employee.find(data).exec();
}

const findUserEmail = (email) => {
  const query = {email: email}
  return User.findOne(query).exec(); 
}

const findUserLocation = (data) => {
  return User.findOne(data).exec();
}

const removeEmployee = (query) => {
  return Employee.remove(query).exec();
}


module.exports = {
  createEmployee,
  getEmployees,
  findUserEmail,
  removeEmployee,
  findUserLocation
}