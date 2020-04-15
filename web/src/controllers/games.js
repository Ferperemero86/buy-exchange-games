const router = require("express").Router();
const knex = require("../db/knex");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const userAuthentication = require("../authentication");

const acl = require("../controllers/acl");
const validation = require("../validation");

const User = require("../db/models/user");
const Lists = require("../db/models/lists");
const Games = require("../db/models/games");

router.post("/createlist",
    jsonParser,
    userAuthentication,
    acl(User, "create"),
    (req, res) => {
        const listName = req.body.listName;
        const userId = req.user.id;
        const valuesValidation = validation.validate({listName}, validation.createList);
        
        return new Lists
                .where({user_id: userId})
                .fetch({require: false})
                .then(result => {
                    return new Promise((resolve, reject) => {
                        if (!result) {
                            return resolve();
                        }
                        return reject({listExists: true})
                    })
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        if (valuesValidation) {
                            return reject({inputValidation: valuesValidation});
                        }
                    
                        return new Lists({ user_id: userId, list_name: listName })
                            .save()
                            .then(result => {
                                if (result) {
                                    return resolve({listCreated: true, listName})
                                }
                            })
                    })
                })
                .then(result => {
                    return res.json(result);
                })
                .catch(err => {
                    if(err.listExists) {
                        return res.status(400).json(err);
                    }
                    if(err.inputValidation) {
                        return res.status(400).json(err);
                    }
                    return res.status(500).json({internalError: true});
                })
});

router.post("/addgametolist",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;
        const gameDetails = req.body.game;
        const nameString = gameDetails.longName;
        const cover = gameDetails.cover;
        const id = gameDetails.id;
        const platform = gameDetails.platform;
        const name = nameString.replace("'", "");

            return new Lists
                .where({user_id: userId})
                .fetch({require: false})
                .then(result => {
                    return new Promise((resolve, reject) => {
                        if (result) {
                            return resolve("list exists");
                        }
                        return reject({listExists: false});
                    })
                })
                .then(() => {
                    return new Games({ game_id: id,
                                        list_id: userId,    
                                        platform: platform, 
                                        name: name,    
                                        cover: cover})
                                    .save()
                                         .then(result => {
                                             return new Promise((resolve, reject) => {
                                                 if (result) {
                                                     return resolve({gameAddedToList: true});
                                                 }
                                                 return reject();
                                             })
                                         })
                                     
                })
                .then(result => {
                    return res.json(result);
                })
                .catch(err => {
                    if(err.listExists === false) {
                        return res.status(400).json(err);
                    }
                    return res.status(500).json({internalError: true}); 
                })
       
});

router.post("/getlist",
    jsonParser,
    (req, res) => {
        const userId = req.body.userId;

        return new Lists()
                .where({"user_id": userId})
                .fetch({columns: "list_name", require: false})
                .then(result => {
                    return new Promise((resolve, reject) => {
                        if (result) {
                            return resolve(result);
                        }                    
                        return reject({listExists: false})
                    })
                })
                .then(list => {   
                    return new Games
                            .where({"list_id": userId})
                            .orderBy("platform")
                            .fetchAll({require:false})
                            .then(result => {       
                                return new Promise((resolve) => {                                 
                                    return resolve({gamesList:result, id: userId, list});
                                })
                            })
                })
                .then(result => {
                    return res.json(result);
                })
                .catch(err => {
                    if (err.listExists === false) {
                        return res.status(400).json(err);
                    }
                    return res.status(500).json({internalError: true});
                })
               
})

router.post("/deletelist",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;
        //Locate and delete list.
        return new Lists
            .where({user_id: userId})
            .fetch({require: false})
            .then(response => {
                return new Promise((resolve, reject) => {
                    //If there is no list send error.
                    if(response) {
                        return resolve();
                    }
                
                    return reject({listExists: false});
                });
            })
            .then(() => {
                return new Lists
                        .where({user_id: userId})
                        .destroy()
                        .then(() => {
                            return new Promise((resolve) => {
                                return resolve({listDeleted: true});
                            })                            
                        })
            })
            .then(response => {
                return res.json(response);
            })
            .catch(err => {
                 //List to delete does not exist.
                if (err.listExists === false ) {
                    return res.status(400).json(err);
                }
                return res.status(500).json({internalError: true});
            })
            
})

router.post("/editlistname",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;
        const name = req.body.listName;
        console.log("name", name);

        knex("lists")
            .where("user_id", userId)
            .update({ list_name: name })
            .then(() => {
                res.json({listNameUpdated: name})
            })
            .catch(() => {
                res.json({listNameUpdated: false})
            })
    })


module.exports = router;
