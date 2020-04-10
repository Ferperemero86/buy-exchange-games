const passport = require("passport");
const User = require("./db/models/user");

function authenticateUser(req, res, next) {
  passport.authenticate("local", function (err, user) {

    if (!req.user) {
      if (err) {
        return res.status(500).json({ internalError: true })
      }
       
      if (!user) {
        return res.status(400).json({ login: false });
      }
       
      req.logIn(user, function(err) {
        if (err) { return res.status(500).json({ internalError: true }) };
       
        next();
      });
   } else {
      next();
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
