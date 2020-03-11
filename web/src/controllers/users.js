const router = require("express").Router();
const knex = require("../db/knex");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const User = require("../db/models/user");
const userAuthentication = require("../authentication");
const { InsertGameInListError, ListDoesNotExistError } = require("./errors");

const validation = require("../validation");

const acl = require("../controllers/acl");

router.get("/test", (req, res) => {
  knex
    .raw("SELECT * from users")
    .then(result => res.send(JSON.stringify(result.rows)));
});

router.post("/user", jsonParser, (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  const valuesValidation = validation.validate(
    { email: req.body.email, password: req.body.password },
    validation.constraints
  );

  if (valuesValidation) {
    res.status(400).json({ valuesValidation });
  }

  const salt = bcrypt.genSaltSync(10);

  bcrypt.hash(password, salt, (err, hash) => {
    new User({
      email,
      password: hash,
    })
      .save()
      .catch(err => {
        res
          .status(500)
          .json({ error: "Failed to save user, please try again" });
      })
      .then(user => {
        res.json({ user });
      });
  });
});

router.post("/session", jsonParser, userAuthentication);

router.post(
  "/editpass",
  jsonParser,
  userAuthentication,
  acl(User, "edit"),
  (req, res) => {
    const password = req.body.updatedPassword;
    const salt = bcrypt.genSaltSync(10);

    bcrypt.hash(password, salt, function (err, hash) {
      knex("users")
        .update({ password: hash })
        .where("id", req.user.id)
        .then(result => res.json({ updatedPassword: true }))
        .catch(err => {
          res
            .status(500)
            .json({ error: "Failed to update password, please try again" });
        });
    });
  }
);

module.exports = router;
