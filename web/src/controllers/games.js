const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const userAuthentication = require("../authentication");

const acl = require("../controllers/acl");
const validation = require("../validation");
const fetchApiData = require("../utils/API");

const User = require("../db/models/user");
const Lists = require("../db/models/lists");
const Games = require("../db/models/games");
const GamesSelling = require("../db/models/games-selling");
const GamesExchanging = require("../db/models/games-exchanging");


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
        const userId = req.body.userId ? req.body.userId : req.user.id;
      
        await new Promise((resolve, reject) => {
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
            const status = req.body.status;
            let query = status ? {"list_id": userId, status: "inList"} : {"list_id": userId};

            console.log("QUERY", query);
            console.log("USERID", userId);
            return Games
                    .where(query)
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
    res.json(req.body.gameId);    
});

router.post("/setgameforsell", 
              userAuthentication, 
              jsonParser, 
              async (req, res) => {
                const gameId = req.body.gameId;
                const userId = req.user.id;
                const price = req.body.gamePrice;
                const currency = req.body.gameCurrency;
                const condition = req.body.gameCondition;
                const description = req.body.gameDescription;

                const valuesValidation = validation.validate({price}, validation.gameForSale);

                await new Promise((resolve, reject) => {
                    return Games
                        .where({game_id: gameId, list_id: userId, status: "inList"})
                        .fetch({require: false})
                        .then(Game => {
                            if (Game) { return resolve(Game) }
                            return reject({gameUpdated: false});                            
                        })
                })
                .then((Game) => {
                    const id = Game.get("id");
                    
                    return new Promise((resolve) => {
                        return Games
                            .where({id})
                            .save({status: "selling"}, {patch: true})
                            .then(() => {
                                return resolve(id);
                            })
                    })
                })
                .then(() => {
                    if (valuesValidation) {
                        return res.status(500).json({inputValidation: valuesValidation});
                    }

                    return new Promise((resolve) => {
                        return GamesSelling
                            .forge()
                            .save({
                                game_id: gameId,
                                price, 
                                currency,
                                condition, 
                                description,  
                                list_id: userId})
                            .then(() => { 
                                return resolve()
                            })
                    })
                })
                .then(() => {
                    return Games
                        .where({list_id: userId})
                        .orderBy("id")
                        .fetchAll({require: false})
                        .then(result => {
                            return res.json({gamesList: result, message: {gameForSellUpdated: true} })
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
                const id = Game.get("game_id");

                if (Game) {
                    return Game
                        .save({status: "inList"}, {patch: true})
                        .then (() => { return resolve(id) })
                }
                return reject({GameNotForSell: true})
            })
    })
    .then(id => {
        return new Promise((resolve) => {
            return GamesSelling
                .where({game_id: id, list_id: userId})
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
                    return res.json({gamesList})
                })
    })
    .catch(err => {
        if(err.GameNotForSell) {
            res.status(400).json(err);
        }
        return res.status(500).json({internalError: true})
    })

});

router.post("/searchgames", 
            jsonParser, 
            userAuthentication, 
            async (req, res) => {
                const game = req.body.game;
                let query;
               
                if (typeof game === "string") {
                    query = `search "${game}"; fields name, cover.url, platforms; where release_dates.platform = (48,49,6); limit 300;`
                } else {
                    query = `fields id, cover.url, name; where id = ${game}; limit 1;`
                }

                const games = await fetchApiData("games", "POST", query);
               
                if ( Array.isArray(games) ) {
                    if (games.length > 0 && !games[0].id) {
                        return res.status(500).json({internalError: true});
                    }

                    return res.json({games});
                }

                return res.status(500).json({internalError: true});
});

router.post("/stopexchanging", 
            jsonParser, 
            userAuthentication,
            async (req, res) => {
                const userId = req.user.id;
                const gameId = req.body.gameId;

                await new Promise((resolve, reject) => {
                    return Games
                        .where({id: gameId, list_id: userId, status: "exchanging"})
                        .fetch()
                        .then(result => {
                            if (result) {
                                return resolve()
                            }
                            return reject({gameNotAvailable: true})
                        })
                })
                .then(() => {
                    return new Promise ((resolve) => {
                        return Games
                            .forge({id: gameId})
                            .save({status: "inList"}, {patch: true})
                            .then(result => {
                                const id = result.get("game_id");
                        
                                return resolve(id)
                            })
                    })
                })
                .then(id => {
                    return new Promise((resolve) => {
                        return GamesExchanging
                            .where({game_1: id, list_id: userId})
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
                        .fetchAll({required: false})
                        .then(result => {
                            return res.json({gamesList: result})
                        })
                })
                .catch(err => {
                    if (err.gameNotAvailable) {
                        return res.status(400).json(err);
                    }
                    return res.status(500).json({internalError: true})
                })
                
                
});

router.post("/exchangegame",
            jsonParser,
            userAuthentication,
            async (req, res) => {
                const game1 = req.body.game1;
                const game2 = req.body.game2;
                const user1 = req.user.id;
                const user2 = req.body.user2 ? req.body.user2 : null;
                const time = new Date().getTime();

                return new Promise((resolve, reject) => {
                    return Games
                        .where({list_id: user1, game_id: game1, status: "inList"})
                        .fetch({require:false})
                        .then(GamesInListRes => {
                                console.log("GAME1", game1);
                                console.log("GAME TO EXCHANGE", GamesInListRes);
                                if (GamesInListRes) {
                                    return resolve()
                                }
                                return reject({GameAlreadyExchanging: true})
                        })
                })
                .then(() => {
                    return new Promise((resolve) => {
                        return GamesExchanging
                        .forge()
                        .save({
                            list_id: user1,
                            user_1: user1,
                            user_2: user2,
                            game_1: game1,
                            game_2: game2,
                            status: "active",
                            time: time
                        })
                        .then(() => {
                            return resolve();
                        })
                    })
                })  
                .then(() => {
                    return new Promise((resolve, reject) => {
                        return Games
                            .where({game_id: game1, list_id: user1})
                            .fetch({require: false})
                            .then(Game => {
                                if (Game) {
                                    return Game
                                        .save({status: "exchanging"}, {patch: true})
                                        .then(() => {
                                            return resolve();
                                            //return res.json({gameSetToExchange: true})
                                        })
                                }
                                return reject();
                        })
                    })
                })
                .then(() => {
                    return Games
                        .where({list_id: user1})
                        .orderBy("id")
                        .fetchAll({require: false})
                        .then(result => {
                            return res.json({gamesList: result, message: {gameSetToExchange: true} });
                        })
                })
                .catch(err => {
                    if (err.GameAlreadyExchanging) {
                        res.status(400).json(err);
                    }

                    return res.status(500).json({internalError: true})
                })

});


module.exports = router;
