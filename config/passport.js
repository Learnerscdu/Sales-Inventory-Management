const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const Employees = require('../models/employees.model');
const config = require('../config/database');

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload.data._id, (err, user) => {
      if(err) {
        return done(err, false);
      }

      if(user) {
        return done(null, user);
      } else {
        Employees.getUserById(jwt_payload.data._id, (err, employee) => {
          if(err) {
            return done(err, false);
          }
    
          if(employee) {
            return done(null, employee);
          } else {
            return done(null, false);
          }
        });
      }
    });
  }));
}
