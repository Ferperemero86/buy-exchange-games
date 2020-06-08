const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const userAuthentication = require("../authentication");
const knex = require("../db/knex");
const Bookshelf = require("../db/bookshelf");

const acl = require("./acl");
const validation = require("../validation");

const User = require("../db/models/user");
const GamesLists = require("../db/models/games-lists");


router.post("/gameslist",
    jsonParser,
    async (req, res) => {
        const userId = req.body.userId ? req.body.userId : req.user.id;
        const status = req.body.status;
        
        return new Promise((resolve, reject) => {
            return GamesLists
                .where({id: userId})
                .fetch({require: false})
                .then(List => {   
                    if (List) {
                        return resolve(List);
                    }                    
                    return reject({listExists: false, gamesList: [], gamesListName: "", id: userId});
                })
        })
        .then(List => { 
            const gamesListName = List.get("list_name");
            let query = status ? {"games_in_list.list_id": userId, status: "inList"} : {"games_in_list.list_id": userId};
           
            return new Promise((resolve) => {
                knex("games_in_list")
                    .select("games_content.name", "games_content.cover", "games_content.platform", "games_in_list.status", "games_in_list.game_id", "games_in_list.id", "games_in_list.game_id")
                    .where(query)
                    .join("games_content", "games_content.id", "=", "games_in_list.game_id")
                    .orderBy("games_in_list.id")
                    .then(result => {
                        return resolve({gamesList: result, id: userId, gamesListName, listExists: true})
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
               
});

router.post("/gameslist/newlist",
    jsonParser,
    userAuthentication,
    acl(User, "create"),
    async (req, res) => {
        const listName = req.body.listName;
        const userId = req.user.id;

        await Bookshelf.transaction(t => {
            return new Promise((resolve, reject) => {
                //Checks if lists exists before creating one
                return GamesLists
                        .where({id: userId})
                        .fetch({require: false})
                        .then(List => {
                            if (!List) {
                                return resolve();
                            }
                            return reject({listAlreadyExists: true})
                        })
            })
            .then(() => {
                //Validates the input to create the list
                const valuesValidation = validation.validate({listName}, validation.createList);
    
                return new Promise((resolve, reject) => {
                    if (valuesValidation) {
                        return reject({inputValidation: valuesValidation});
                    }
                    //Saves the new list in the database
                    return GamesLists
                        .forge({id: userId, list_name: listName})
                        .save(null, {method: 'insert', transacting: t})
                        .then(() => {
                           return resolve({listCreated: true, gamesListName: listName, listExists: true})
                        })
                })
            })
        })
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            if(err.listAlreadyExists) {
                return res.status(400).json(err);
            }
            if(err.inputValidation) {
                return res.status(400).json(err);
            }
            return res.status(500).json({internalError: true});
        })
});

router.post("/gameslist/deletedlist",
    jsonParser,
    userAuthentication,
    async (req, res) => {
        const userId = req.user.id;

        await Bookshelf.transaction(t => {
            return new Promise((resolve, reject) => {
                //Locate list
                return GamesLists
                    .where({id: userId})
                    .fetch({require: false})
                    .then(List => {
                        if(List) {
                            return resolve();
                        }
                    
                        return reject({listExists: false});
                    })
            })       
            .then(() => {
                return GamesLists
                        .where({id: userId})
                        .destroy({transacting: t})
                        .then(() => {
                            return new Promise((resolve) => {
                                return resolve({listDeleted: true, listExists: false});
                            })                            
                        })
            })
        })
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
             //List to delete does not exist.
            if (err.listExists === false ) {
                return res.status(400).json(err);
            }
            return res.status(500).json({internalError: true});
        })
            
});

router.post("/gameslist/name",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    async (req, res) => {
        const name = req.body.listName;
        const userId = req.user.id;

        await GamesLists
            .where({id: userId})
            .save({list_name: name}, {patch: true})
            .then(() => {
                return res.json({listNameUpdated: name});
            })
            .catch(()=> {
                return res.status(500).json({internalError: true});
            })
});



module.exports = router;