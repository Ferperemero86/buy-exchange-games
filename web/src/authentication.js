const passport = require("passport");

function authenticateUser(req, res, next) {
  passport.authenticate("local", function(err, user) {
    if (!req.user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ login: false });
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ login: true });
      });
    } else {
      next(null, user);
    }
  })(req, res, next);
}

module.exports = authenticateUser;
