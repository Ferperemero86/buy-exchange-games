const router = require("express").Router();
const knex = require("../db/knex");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({type: "application/json"});
const Bookshelf = require("../db/bookshelf");
const cities = require("all-the-cities");
const countryList = require('country-list');
const validation = require("../validation");

const acl = require("../controllers/acl");
const userAuthentication = require("../authentication");

const User = require("../db/models/user");
const UserProfile = require("../db/models/user-profile");


router.post("/user/new", 
            jsonParser, 
            async (req, res) => {
              const {email, password, nickName, country, city} = req.body;
             
              const valuesValidation = validation.validate(
                {email, password, nickName, country},
                validation.register
              );
              
              if (valuesValidation) {
                return res.status(400).json({ inputValidation: valuesValidation });
              }
             
              const salt = bcrypt.genSaltSync(10);

              Bookshelf.transaction(t => {
                return User
                  .where("email", email)
                  .fetch({require: false})
                  .then(result => {
                    return new Promise((resolve, reject) => {
                      if (result) {
                        return reject({userExists: true});  
                      }
                      return resolve();
                    })
                })
                .then(() => {
                  return UserProfile
                    .where({nickName})
                    .fetch({require: false})
                    .then(result => {
                      return new Promise((resolve, reject) => {
                        if (result) {
                          return reject({nickNameExists: true})
                        }
                        return resolve();
                      })
                    })
                })
                .then(() => {
                  return new Promise((resolve, reject) => {
                    return bcrypt.hash(password, salt, (err, hash) => {
                      if (err) {
                        return reject();
                      }
  
                      return User
                        .forge({email, password: hash})
                        .save(null, {method: 'insert', require: false, transacting: t})
                        .then(user => {
                          const userId = user.get("id");
                         
                          if (user) {
                            return resolve(userId);
                          }
                          return reject();
                        })
                      })
                    })
                  })
                  .then(userId => {
                    return UserProfile
                      .forge(
                        {id: userId, nickName, country, city}, 
                        {transacting: t})
                      .save(null, {method: 'insert', require: false, transacting: t})
                      .then(() => {
                        return res.json({userCreated: true})
                      })
                  })
                  .catch(err=> {
                    if (err.userExists || err.nickNameExists) { 
                      return res.status(400).json(err); 
                    }
                    return res.status(500).json({internalError: true});
                  })
                })
});

router.post('/session', 
            jsonParser,   
            userAuthentication, (req, res) => {
              const userId = req.user.id;

              return res.json({login: true, userId});
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
          res.status(500).json({ error: "Could not edit pass" });
        });
    });
  }
);

router.post("/cities",
            jsonParser,
            (req, res) => {
              const {selectedCountryCode} = req.body;
          
              const cityNames= cities.filter(city => city.country === selectedCountryCode && city.population > 30000)
                                     .map(city => {return city.name});

              cityNames.sort();
             
              return res.json({cities: cityNames})
});

router.get("/countries",
            jsonParser,
            (req, res) => {
              let countryNames = [];
              const countries = countryList.getNameList();

              Object.keys(countries).map(country => {
                  countryNames.push(country);
              });

              countryNames.sort();
              
              return res.json({countries, countryNames})
});


module.exports = router;
