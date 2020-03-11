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
    secret: 'W$q4=25*8%v-}UV',
    secure: false,
    name: "user_id",
    resave: false,
    saveUninitialized: false
  };

  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

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
        User.where({ email })
          .fetch()
          .then(
            user =>
              new Promise((resolve, reject) => {
                bcrypt.compare(
                  password,
                  user.get("password"),
                  (err, response) => {
                    if (err || !response) {
                      return reject(err);
                    }
                    resolve(user);
                  }
                );
              })
          )
          .catch(err => done(null, false))
          .then(user => done(null, user));
      }
    )
  );

  server.use("/api", routes);

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
