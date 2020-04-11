const router = require("express").Router();
const knex = require("../db/knex");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const userAuthentication = require("../authentication");

const acl = require("../controllers/acl");

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

        return new Promise((resolve, reject) => {
            Lists("user_id", userId)
                .fetch({ require: false })
                .then(result => {
                    if (result.length > 0) {
                        reject({ listExists: true })
                    }
                    resolve();
                })
        })
            .then(() => {
                Lists({ user_id: userId, list_name: listName })
                    .save();

                    return res.json({ listCreated: true })
            })
            .catch(err => {
                if(err.listExists) {
                    return res.status(400).json(err);
                }
                return res.status(400).json({ listExists: false });
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

            return Lists
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
                    return Games
                       .forge({
                           game_id: id,
                           list_id: userId,
                           platform: platform,
                           name: name,
                           cover: cover
                       })
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
                        return res.status(404).json(err);
                    }
                    return res.status(500).json({internalError: true}); 
                })
       
    });

router.post("/getlist",
    jsonParser,
    (req, res) => {
        const userId = req.body.userId;

        return Lists
                .where({"user_id": userId})
                .fetch({require: false})
                .then(result => {
                    return new Promise((resolve, reject) => {
                        if (result) {
                            return resolve()
                        }                        
                        return reject({listExists: false})
                    })
                })
                .then(()=> {
                    return Games
                            .where({"list_id": userId})
                            .fetchAll({require:false})
                            .then(result => {                                
                                return new Promise((resolve) => {                                
                                    return resolve({gamesList:result});
                                })
                            })
                })
                .then(result => {
                    return res.json(result);
                })
                .catch(err => {
                    if (err.listExists === false) {
                        return res.status(404).json(err);
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
        knex("lists")
            .where("user_id", userId)
            .del()
            .then(response => {
                return new Promise((resolve, reject) => {
                    //If there is no list send error.
                    if(response < 1) {
                        return reject({listExists: false, action: "listDeleted", type: "error"});
                    }
                    resolve({listDeleted: true, action: "listDeleted", type: "error"});
                });
            })
            .then(response => {
                return res.json(response);
            })
            .catch(err => {
                 //List to delete does not exist.
                if (err.listExists === false ) {
                    res.status(400).json(err);
                }
                //Could not delete List generic error.
                res.status(400).json({listDeleted: false, action: "listDeleted" ,type: "error"});
            })
            
})

router.post("/editlistname",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;
        const name = req.body.dataContent;

        knex("lists")
            .where("user_id", userId)
            .update({ list_name: name })
            .then(() => {
                res.json({ listNameUpdated: name })
            })
            .catch(() => {
                res.json({ listNameUpdated: false})
            })
    })


module.exports = router;
