const next = require("next");
const yn = require("yn");

const port = process.env.PORT;
const dev = yn(process.env.NEXT_DEV);
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

nextApp.prepare().then(() => {
  const server = express();
  const routes = require("./router/api.js");
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const bcrypt = require("bcrypt");
  const User = require("./db/models/user");
  const sess = {
    secret: 'keyboard cat',
    name: "user_id",
    cookie: {
      httpOnly: false,
      expires: 3600000
    },
    resave: false,
    saveUninitialized: false
  };


  server.use(cookieParser('W$q4=25*8%v-}UV'));
  server.use(session(sess));
  server.use(passport.initialize());
  server.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        return User .where("email", email)
        .fetch({ require: true })
        .then(user => {
          return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.get("password"), (err, matched) => {
              if (err) { 
                return reject(err)
              };

              if (!matched) { 
                return reject(); 
              }

              resolve(user);

            });
          })
      })
      .then(user => {
        done(null, user)
      })
      .catch(err => {
        if (err) {
          return done(err);
        }
        return done (null, false);
      })
    })
  )
  

  server.use("/api", routes);

  server.get("*", (req, res) => {
    return handle(req, res);
  });


  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
