const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Employees = require('../models/employees.model');
const userService = require('../services/user.service');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const HttpStatus = require('http-status-codes');
// const Location = mongoose.model('Location');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    location: req.body.location
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {

      res.json({ success: true, msg: 'User registered' });
    }
  });
});

router.post('/employee_register', (req, res, next) => {
  let newEmployee = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    manager_id: req.body.manager_id,
    password: "employeepass"
  };

  userService.findUserEmail(req.body.email)
    .then((response) => {
      if (!response) {
        return userService.createEmployee(newEmployee);
      } else {
        throw {
          reason: "exists"
        }
      }
    })
    .then((response) => {
      if (!response) {
        throw {
          reason: "failed"
        }

      } else {
        res.json({ success: true, msg: 'Employee  registered' });
      }
    })
    .catch((err) => {
      if (err.reason == "exists") {
        return res.json({ success: false, msg: 'Emailid already exists!' });
      } else if (err.reason == "failed") {
        res.json({ success: false, msg: 'Failed to register user', error: err });
      } else if (err.name === 'MongoError' && err.code === 11000) {
        return res.json({ success: false, msg: 'duplicate error', error: err });
      } else {
        return res.json({ success: false, msg: 'Internal server error', error: err });
      }
    })

});

// Authenticate
router.post('/authenticate', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      // return res.json({success: false, msg: 'User not found'});
      Employees.getUserByUsername(username, (err, employee) => {
        if (err) throw err;
        if (!employee) {
          return res.json({ success: false, msg: 'User not found' });
        }

        Employees.comparePassword(password, employee.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const token = jwt.sign({ data: employee }, config.secret, {
              expiresIn: 604800 // 1 week
            });
            res.json({
              success: true,
              token: 'JWT ' + token,
              user: {
                id: employee._id,
                username: employee.username,
                manager_id:employee.manager_id,
                email: employee.email,
                role: "employee"
              }
            })
          } else {
            return res.json({ success: false, msg: 'Wrong password' });
          }
        });
      });
    }
    else {
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign({ data: user }, config.secret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              role: "manager",
              location: user.location
            }
          })
        } else {
          return res.json({ success: false, msg: 'Wrong password' });
        }
      });
    }
  });

});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user });
});

router.post('/get_all_employees', (req, res, next) => {
  let query = { manager_id: objectId(req.body.manager_id) }
  userService.getEmployees(query)
    .then((response) => {
      if (response) {
        res.status(HttpStatus.CREATED).json({ error: "0", message: "Successfully fetched employees.", data: response });
      }
      else {
        res.status(HttpStatus.NOT_FOUND).json({ error: "1", message: "Id " + HttpStatus.getStatusText(HttpStatus.NOT_FOUND) });
      }
    })
    .catch((error) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "2", message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
    });
});

router.post('/remove_employee', (req, res) => {
  let query = { _id: objectId(req.body.employee_id) };
  userService.removeEmployee(query)
    .then((response) => {
      if (response) {
        res.status(HttpStatus.CREATED).json({ error: "0", message: "Successfully deleted the employee." });
      }
      else {
        res.status(HttpStatus.NOT_FOUND).json({ error: "1", message: "Id " + HttpStatus.getStatusText(HttpStatus.NOT_FOUND) });
      }
    })
    .catch((error) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "2", message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
    });
})

module.exports = router;
