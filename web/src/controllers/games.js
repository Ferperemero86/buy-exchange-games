const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const userAuthentication = require("../authentication");

const acl = require("../controllers/acl");
const validation = require("../validation");

const User = require("../db/models/user");
const Lists = require("../db/models/lists");
const Games = require("../db/models/games");
const GamesSelling = require("../db/models/games-selling");


router.post("/createlist",
    jsonParser,
    userAuthentication,
    acl(User, "create"),
    async (req, res) => {
        await new Promise((resolve, reject) => {
            const userId = req.user.id;
            
            return Lists
                    .where({user_id: userId})
                    .fetch({require: false})
                    .then(result => {
                        if (!result) {
                            return resolve(userId);
                        }
                        return reject({listExists: true})
                    })
        })
        .then(userId => {
            const listName = req.body.listName;
            const valuesValidation = validation.validate({listName}, validation.createList);

            return new Promise((resolve, reject) => {
                if (valuesValidation) {
                    return reject({inputValidation: valuesValidation});
                }
            
                return Lists
                    .forge({ user_id: userId, 
                             list_name: listName})
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
    async (req, res) => {
        await new Promise((resolve, reject) => {
            const userId = req.user.id;
            
            return Lists
                .where({user_id: userId})
                .fetch({require: false})
                .then(result => {
                    if (result) {
                        return resolve(userId);
                    }
                    return reject({listExists: false});
                })
        })
        .then(userId => {
            const gameDetails = req.body.game;
            const nameString = gameDetails.title;
            const cover = gameDetails.cover;
            const id = gameDetails.id;
            const platform = gameDetails.platform;
            const name = nameString.replace("'", "");

            return Games
                    .forge({ 
                        game_id: id,
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
    async (req, res) => {
        await new Promise((resolve, reject) => {
            const userId = req.body.userId;

            return Lists
                .where({"user_id": userId})
                .fetch({columns: "list_name", require: false})
                .then(result => {   
                    if (result) {
                        return resolve({result, userId});
                    }                    
                    return reject({listExists: false});
                })
        })
        .then(list => { 
            return Games
                    .where({"list_id": list.userId})
                    .orderBy("id")
                    .fetchAll({require:false})
                    .then(result => {       
                        return new Promise((resolve) => {                                 
                            return resolve({gamesList: result, id: list.userId, list});
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

router.post("/deletelist",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    async (req, res) => {
        await new Promise((resolve, reject) => {
            const userId = req.user.id;

            //Locate and delete list.
            return Lists
            .where({user_id: userId})
            .fetch({require: false})
            .then(response => {
                //If there is no list send error.
                if(response) {
                    return resolve(userId);
                }
            
                return reject({listExists: false});
            })
        })       
        .then((userId) => {
            return Lists
                    .where({user_id: userId})
                    .destroy()
                    .then(() => {
                        return new Promise((resolve) => {
                            return resolve({listDeleted: true});
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

router.post("/editlistname",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    async (req, res) => {
        await new Promise((resolve) => {
            const userId = req.body.userId;
            const name = req.body.listName;

            return Lists
                .where({"user_id": userId})
                .save({ list_name: name }, {patch: true})
                .then(() => {
                    return resolve({listNameUpdated: name});
                })
        })
        .then(result => {
            return res.json(result);
        })
        .catch(()=> {
            return res.status(500).json({internalError: true});
        })
});

router.post("/deletegame",
    userAuthentication,
    jsonParser,
    async (req, res) => {
        const gameID = req.body.gameID;
        const userId = req.user.id;
        
        await new Promise((resolve) => {
            return Games
                .where({id: gameID })
                .fetch({require: true})
                .then(result => {
                   return resolve(result);
                })
        })
        .then(Game => {
            return new Promise((resolve) => {
                Game
                .destroy()
                .then(() => {
                    resolve()
                })

            })            
        })
        .then(() => {
            return Games
                .where({list_id: userId})
                .fetchAll({require: false})
                .then(result => {
                   res.json({gamesList: result})
                })
        })
        .catch(() => {
            res.status(500).json({internalError: true});
        })
           
});

router.post("/finduserwithgame", jsonParser, (req, res) => {
    console.log("gameId", req.body.gameId);
    res.json(req.body.gameId);    
});

router.post("/setgameforsell", 
              userAuthentication, 
              jsonParser, 
              async (req, res) => {
                const gameId = req.body.gameId;
                const userId = req.user.id;
                const status = req.body.status;
                const price = req.body.gamePrice;
                const currency = req.body.gameCurrency;
                const condition = req.body.gameCondition;
                const description = req.body.gameDescription;

                const valuesValidation = validation.validate({price}, validation.gameForSale);

                await new Promise((resolve, reject) => {
                    return Games
                        .where({id: gameId, list_id: userId})
                        .fetch({require: false})
                        .then(Game => {
                            if (Game) { return resolve(Game) }
                            return reject({gameUpdated: false});                            
                        })
                })
                .then(Game => {
                    return Game
                        .save({status}, {patch: true})
                        .then(() => {
                            return new Promise((resolve, reject) => {
                                return GamesSelling
                                        .where({id: gameId, list_id: userId})
                                        .fetch({require: false})
                                        .then(Game => {
                                            if (Game) { 
                                                return reject({gameAlreadySelling: true})
                                            }
                                            return resolve();
                                        })
                            })
                        })
                
                })
                .then(() => {
                    if (valuesValidation) {
                        return res.status(500).json({inputValidation: valuesValidation});
                    }

                    return GamesSelling
                            .forge()
                            .save({
                                price, 
                                currency,
                                condition, 
                                description, 
                                id: gameId, 
                                list_id: userId})
                            .then(() => { 
                                console.log("sending info");
                                return res.json({gameForSellUpdated: true}) 
                            })
                })
                .catch(err => {
                    if (err.gameUpdated === false) {
                        return res.status(400).json(err);
                    }
                    if (err.updatedGamesList === false) {
                        return res.status(500).json(err);
                    }
                    if (err.gameAlreadySelling) {
                        return res.status(400).json(err);
                    }
                    return res.status(500).json({internalError: true})
                })
});

router.post("/stopselling", jsonParser, userAuthentication, async (req, res) => {
    const userId = req.user.id;
    const gameId = req.body.gameId;

    await new Promise((resolve, reject) => {
        return Games
            .where({list_id: userId, id: gameId, status: "selling"})
            .fetch({require: false})
            .then(Game => {
                if (Game) {
                    return Game
                            .save({status: "inList"}, {patch: true})
                            .then (() => { return resolve() })
                }
                return reject({GameNotForSell: true})
            })
    })
    .then(() => {
        return new Promise((resolve) => {
            return GamesSelling
                    .where({id: gameId, list_id: userId})
                    .destroy()
                    .then(() => {
                        return resolve();
                    })
        })
    })
    .then(() => {
        return Games
                .where({list_id: userId})
                .orderBy("id")
                .fetchAll({require: false})
                .then(gamesList => {
                    console.log(gamesList);
                    return res.json({gamesList})
                })
    })
    .catch(err => {
        if(err.GameNotForSell) {
            res.status(400).json(err);
        }
        return res.status(500).json({internalError: true})
    })

})


module.exports = router;
