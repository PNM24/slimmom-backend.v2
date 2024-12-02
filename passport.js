const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("./models/User");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

//! JWT Strategy:
passport.use(
  new Strategy(params, function (payload, done) {
    User.findById(payload.userId)
      .then((user) => {
        if (!user) {
          return done(new Error("User not found"), false);
        }
        return done(null, user);
      })
      .catch((err) => done(err, false));
  })
);

module.exports = passport;
