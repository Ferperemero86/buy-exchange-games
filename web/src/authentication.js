const passport = require("passport");
const User = require("./db/models/user");

function authenticateUser(req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (!req.user) {
      if (!user) {
        return res.status(400).json({ login: false });
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        next(null, user);
        return res.status(200).json({ login: true });
      });
    } else {
      next(null, req.user);
    }
  })(req, res, next);

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.where({ id: id })
      .fetch()
      .then(user => {
        done(null, user);
      });
  });
}

module.exports = authenticateUser;
