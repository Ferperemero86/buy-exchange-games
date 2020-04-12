const router = require("express").Router();
const knex = require("../db/knex");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const User = require("../db/models/user");
const userAuthentication = require("../authentication");

const validation = require("../validation");

const acl = require("../controllers/acl");


router.post("/user", jsonParser, (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  const valuesValidation = validation.validate(
    { email: req.body.email, password: req.body.password },
    validation.register
  );

  if (valuesValidation) {
    return res.status(400).json({ inputValidation: valuesValidation });
  }

  const salt = bcrypt.genSaltSync(10);

  return User
    .where("email", email)
    .fetch()
    .then ( result => {
      if (result) {
        return res.status(400).json({ userExists: true });  
      }
    })
    .catch(()=> {
      return bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return res.status(500).json({ register: "wrong" })
        }
        
        new User({
          email,
          password: hash,
        })
          .save();
      
          return res.json({ register: true });
      });
    })
});

router.post('/session', jsonParser, userAuthentication, (req, res) => {
  res.json({login: true});
});


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
        .then(() => res.json({ updatedPassword: true }))
        .catch(() => {
          res
            .status(500)
            .json({ error: "Could not edit pass" });
        });
    });
  }
);

module.exports = router;
