const passport = require("passport");

function authenticateUser(req, res, next) {
  passport.authenticate("local", function (err, user) {
    console.log("USER PASSPORT", user);
    if (!req.user) {
      console.log("NO REQ USER");
      if (err) {
        return res.status(500).json({ internalError: true })
      }
       
      if (!user) {
        console.log("NO USER");
        return res.status(400).json({ login: false });
      }
       
      req.logIn(user, function(err) {
        if (err) { return res.status(500).json({ internalError: true }) }
       
        next();
      });
   } else {
      next();
   }
  })(req, res, next);

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
}

module.exports = authenticateUser;
