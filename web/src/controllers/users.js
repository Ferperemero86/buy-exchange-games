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
const UsersConversations = require("../db/models/users-conversations");
const Conversations = require("../db/models/conversations");
const UsersMessages = require("../db/models/users-messages");

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

router.post("/user/message/save",
            jsonParser,
            userAuthentication,
            async (req, res) => {
              const sender = parseInt(req.user ? req.user.id : null);
              const {recipient, message} = req.body;

              UsersConversations
                .where({user_id: sender})
                .fetchAll({withRelated: ["users"]})
                .then(conversations => {
                  return new Promise((resolve) => {
                    if (conversations.length < 1) { return resolve("save new") }

                    const convMatch = conversations.filter(conv => {
                      const users = conv.related("users");

                      return users.find(user => { return user.get("user_id") === recipient})
                    })
                    if (convMatch.length > 0) {
                      const conversationId = convMatch[0].get("conversation_id");
                      return resolve(conversationId);
                    }
                    return resolve("save new");
                  })
                }) 
                .then(conversationId => {
                  return new Promise((resolve) => {
                    if (conversationId === "save new") {
                      return Conversations
                        .forge()
                        .save()
                        .then(conv => {
                          const convId = conv.get("id");
  
                          const usersConv = ([
                              {user_id: sender, conversation_id: convId},
                              {user_id: recipient, conversation_id: convId}
                          ]);

                          return UsersConversations
                            .collection(usersConv)
                            .invokeThen("save", null, {method: "insert"})
                            .then(() => {
                              console.log("saved!!!", convId); 
                              return resolve(convId)                                              
                            })
                        })
                    }
                    return resolve(conversationId);
                  })  
                })    
                .then(convId => {
                  UsersMessages
                    .forge({
                      conversation_id: convId,
                      user_id: sender,
                      message
                    }) 
                    .save()
                    .then(() => {
                      return res.json({messageSent: true});
                    })    
                })
                .catch(err => {
                  console.log("ERR", err);
                  if (err.login === false) { return res.status(401).json(err) }
                  return res.status(500).json({internalError: true})
                })
});

router.post("/user/messages",
            jsonParser,
            (req, res) => {
              const userId = req.body ? req.body.userId : req.user.id; 
              
                UsersConversations
                  .where({user_id: userId})
                  .fetchAll({
                    withRelated: ["users", "messages"]
                  })                
                  .then(conversations => {  
                    let usersArray = [];

                    conversations.map(conversation => {
                      const users = conversation.related("users");
                      users.map(user => {
                        const id = user.get("user_id");

                        if (usersArray.indexOf(id) === -1) {
                          usersArray.push(id);
                        }
                      })
                    })
                    UserProfile
                      .where("id", "IN", usersArray)
                      .fetchAll()
                      .then(users => {
                        return res.json({conversations, users})   
                      })
                  })
                  .catch(err => {
                    console.log("ERROR", err);
                    return res.json({internalError: true})
                  })
});

router.post("/user/profiles",
        jsonParser,
        (req, res) => {
          const {profilesArray} = req.body;

          UserProfile
            .where("id", "IN", profilesArray)
            .fetchAll()
            .then(profiles => {
              console.log("PROFILES", profiles);
              return res.json({profiles})
            })

})


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
