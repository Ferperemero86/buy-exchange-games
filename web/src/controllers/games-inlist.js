const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const userAuthentication = require("../authentication");
const knex = require("../db/knex");
const Bookshelf = require("../db/bookshelf");

//const acl = require("./acl");
const validation = require("../validation");
const {fetchApiData} = require("../utils/API");

//const User = require("../db/models/user");
const GamesLists = require("../db/models/games-lists");
const GamesInList = require("../db/models/games-inlist");
const GamesSelling = require("../db/models/games-selling");
const GamesExchanging = require("../db/models/games-exchanging");
const GamesContent = require("../db/models/games-content");

router.post("/gamesinlist/game/add",
    jsonParser,
    userAuthentication,
    async (req, res) => {
        const gameDetails = req.body.game;
        const userId = req.user.id;
        const nameString = gameDetails.title;
        const {cover, id, summary, platform} = gameDetails;
        const name = nameString.replace("'", "");
        
        await Bookshelf.transaction(t => {
            return new Promise((resolve, reject) => {            
                //Check if gameslist exists first
                return GamesLists
                    .where({id: userId})
                    .fetch({require: false}, {transacting: t})
                    .then(List => {                    
                        if (List) {
                            return resolve(List);
                        }
                        return reject({listExists: false});
                    })
            })
            .then(List => {
                //Saves the game in the gameslist
                return GamesInList
                        .forge({ game_id: id,
                                 list_id: userId })
                        .save(null, {method: 'insert', transacting: t})
                            .then(Game => {                            
                               return new Promise((resolve, reject) => {
                                    if (Game) {
                                        return resolve(List);
                                    }                                
                                    return reject();
                               })
                            })
                             
            })
            .then(List => {
                //Check if the game exists in games_content
                return GamesContent
                    .where({id: id})
                    .fetch({require: false}, {transacting: t})
                    .then(Game => {
                        return new Promise((resolve) => {
                            //If game exists continue
                            if (Game) { 
                                return resolve() 
                            }
    
                            //If it does not exist insert content in table
                            return GamesContent
                                .forge({name,
                                        id,
                                        cover,
                                        platform,
                                        summary})
                                .save(null, {method: "insert", transacting: t})
                                .then(() => {
                                    return resolve(List);
                                })
                        })
                    })
    
            })
        })
        .then(List => {
            const gamesListName = List.get("list_name");

            knex("games_in_list")
                .select("games_content.name", "games_content.cover", "games_content.platform", "games_content.summary", "games_in_list.id", "games_in_list.game_id", "games_in_list.status")
                .where({"games_in_list.list_id": userId})
                .join("games_content", "games_content.id", "=", "games_in_list.game_id")
                .orderBy("games_in_list.id")
                .then(result => {
                    return res.json({gamesList: result, id: userId, gamesListName, listExists: true})
                })
        })
        
        .catch(err => {
            if (err.listExists === false) {
                return res.status(400).json(err);
            }
            return res.status(500).json({internalError: true}); 
        })
       
});


router.post("/gamesinlist/game/delete",
    userAuthentication,
    jsonParser,
    async (req, res) => {
        const gameID = req.body.gameId;
        const userId = req.user.id;
        
       await Bookshelf.transaction(t => {
            return new Promise((resolve, reject) => {
                //Checks if game exists
                return GamesInList
                    .where({id: gameID })
                    .fetch({require: false}, {transacting: t})
                    .then(Game => {
                       if (Game) {  return resolve(Game); }
                        return reject({GameExists: false})
                    })
            })
            .then(Game => {
                //Deletes the game if exists
                return new Promise((resolve) => {
                    Game
                    .destroy({transacting: t})
                    .then(() => {
                        return resolve()
                    })
                })            
            })
        })
        .then(() => {
            //Returns updated gameslist
            knex("games_in_list")
                .select("games_content.name", "games_content.cover", "games_content.platform", "games_content.summary", "games_in_list.id", "games_in_list.game_id", "games_in_list.status")
                .where({"games_in_list.list_id": userId})
                .join("games_content", "games_content.id", "=", "games_in_list.game_id")
                .orderBy("games_in_list.id")
                .then(result => {
                    return res.json({gamesList: result})
                })
        })
        .catch(err => {
            if (err.GameExists === false) {
                return res.status(400).json({GameExists: false})
            }
            return res.status(500).json({internalError: true});
        })
           
});

router.post("/finduserwithgame", jsonParser, (req, res) => {
    res.json(req.body.gameId);    
});

router.post("/gamesinlist/game/sell", 
              userAuthentication, 
              jsonParser, 
              async (req, res) => {
                  const userId = req.user.id;
                  const {gameId, price,
                         currency, condition, description} = req.body;
              
                        await Bookshelf.transaction(t => {
                            //Checks if the price input value is valid
                            const valuesValidation = validation.validate({price}, validation.gameForSale);
                            
                            return new Promise((resolve, reject) => {
                                //If a value is returned from valuesValidation the input was not correct
                                if (valuesValidation) {
                                    return reject({inputValidation: valuesValidation});
                                }
                                //Checks if game is available for sale
                                return GamesInList
                                    .where({game_id: gameId, list_id: userId, status: "inList"})
                                    .fetch({require: false})
                                    .then(Game => {
                                        console.log("GAME", Game)
                                        if (Game) { return resolve(Game) }
                                        return reject({gameUpdated: false});                            
                                    })
                            })
                            .then((Game) => {
                                const id = Game.get("id");
                                
                                return new Promise((resolve) => {
                                    //Updates game status
                                    return GamesInList
                                        .where({id})
                                        .save({status: "selling"}, {patch: true, transacting: t})
                                        .then(() => {                    
                                            return resolve(id);
                                        })
                                })
                            })
                            .then(() => {        
                                //Saves game in sellings table (games_selling)
                                return GamesSelling
                                    .forge({
                                        game_id: gameId,
                                        price, 
                                        currency,
                                        condition, 
                                        description,  
                                        list_id: userId})
                                    .save(null, {method: "insert", transacting: t})
                                    .then(() => { 
                                        return res.json({GameSetForSelling: true})
                                    })
                                
                                })
                            })
                            .catch(err => {
                                if (err.gameUpdated === false || err.gameAlreadySelling || err.inputValidation ) {
                                    return res.status(400).json(err);
                                }
                                return res.status(500).json({internalError: true})
                            })
});

router.post("/gamesinlist/game/stopselling", 
            jsonParser, 
            userAuthentication, 
            (req, res) => {

                const userId = req.user.id;
                const gameId = req.body.gameId;

                Bookshelf.transaction(t => {
                    //Check if the games selling exists in list
                    return GamesInList
                        .where({list_id: userId, id: gameId, status: "selling"})
                        .fetch({require: false})
                        .then(Game => {
                            console.log("first then");
                            //If games exists updates status to a default one
                            return new Promise((resolve, reject) => {
                                if (Game) {
                                    const id = Game.get("game_id");
                                
                                    return Game
                                        .save({status: "inList"}, {patch: true, transacting: t})
                                        .then (() => { return resolve(id) })
                                } else {  return reject({GameNotForSell: true}) }
                            });
                        })
                    .then(id => {
                        console.log("2 then");
                        //return new Promise((resolve, reject) => {
                            //Deletes Game from games selling table (games_selling)
                            return GamesSelling
                                .where({game_id: id, list_id: userId})
                                .fetch({required: false})
                                .then(Game => {
                                    return new Promise((resolve, reject) => {
                                        if (Game) { 
                                            console.log("GAME", Game);
                                            return Game
                                                .destroy({transacting: t})
                                                .then(() => {  
                                                    console.log("destoyed!");
                                                    return resolve() 
                                                })
                                        }
                                        return reject();
                                    
                                    })
                                })
                        //})
                    })
                })
                .then(() => {
                    console.log("3 then");
                    //Returns an updated gameslist
                    knex("games_in_list")
                        .select("games_content.name", "games_content.cover", "games_content.platform", "games_in_list.status", "games_in_list.game_id", "games_in_list.id")
                        .where({"games_in_list.list_id": userId})
                        .join("games_content", "games_content.id", "=", "games_in_list.game_id")
                        .orderBy("games_in_list.id")
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

router.post("/gamesinlist/game/search", 
            jsonParser, 
            userAuthentication, 
            async (req, res) => {
                const game = req.body.game;
                const userId = req.user.id;
                const gameSelected = req.body.gameSelected;
                let query;
                
                if (typeof game === "string") {
                    query = `search "${game}"; fields name, cover.url, platforms; where release_dates.platform = (48,49,6); limit 300;`;
                    const games = await fetchApiData("games", "POST", query);

                    return res.json({gamesList: games})

                } else {
                    if (gameSelected === "game1") {
                        knex("games_in_list")
                            .select("games_content.name", "games_content.cover", "games_content.platform", "games_in_list.status", "games_in_list.game_id", "games_in_list.id")
                            .where({"games_in_list.list_id": userId, "games_in_list.id": game})
                            .join("games_content", "games_content.id", "=", "games_in_list.game_id")
                            .orderBy("games_in_list.id")
                            .then(gamesList => {
                                return res.json({gamesList})
                            })
                            .catch(() => {
                                return res.status(500).json({internalError: true});
                            })
                    } else if (gameSelected === "game2") {
                        query = `fields id, cover.url, name; where id = ${game}; limit 1;`;
                        const games = await fetchApiData("games", "POST", query);

                        return res.json({gamesList: games});
                    }
                }
});

router.post("/gamesinlist/game/stopexchanging", 
            jsonParser, 
            userAuthentication,
            async (req, res) => {
                const userId = req.user.id;
                const gameId = req.body.gameId;

                await Bookshelf.transaction(t => {
                    return new Promise((resolve, reject) => {
                        //Checks if the game is already exchanging
                        return GamesInList
                            .where({id: gameId, list_id: userId, status: "exchanging"})
                            .fetch({require: false})
                            .then(Game => {
                                if (Game) {
                                    return resolve()
                                }
                                return reject({gameNotAvailable: true})
                            })
                    })
                    .then(() => {
                        return new Promise ((resolve) => {
                            //Changes status in game to default
                            return GamesInList
                                .forge({id: gameId})
                                .save({status: "inList"}, {patch: true, transacting: t})
                                .then(Game => {
                                    const id = Game.get("game_id");
                            
                                    return resolve(id)
                                })
                        })
                    })
                    .then(id => {
                        return new Promise((resolve) => {
                            //Removes Game form exchangin games table (games_exchanging)
                            return GamesExchanging
                                .where({game_1: id, list_id: userId})
                                .destroy({transacting: t})
                                .then(() => {
                                    return resolve();
                                })
                        })
                    })
                })
                .then(() => {
                    knex("games_in_list")
                        .select("games_content.name", "games_content.cover", "games_content.platform", "games_content.summary", "games_in_list.id", "games_in_list.status")
                        .where({"games_in_list.list_id": userId})
                        .join("games_content", "games_content.id", "=", "games_in_list.game_id")
                        .orderBy("games_in_list.id")
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

router.post("/gamesinlist/game/exchange",
            jsonParser,
            userAuthentication,
            async (req, res) => {
                const {game1, game2} = req.body;
                const user1 = req.user.id;
                const user2 = req.body.user2 ? req.body.user2 : null;
                const time = new Date().getTime();

                await Bookshelf.transaction(t => {
                    return new Promise((resolve, reject) => {
                        //Check if the game is available to exchange
                        return GamesInList
                            .where({list_id: user1, id: game1, status: "inList"})
                            .fetch({require:false, transacting: t})
                            .then(Game => {
                                if (Game) {
                                    return resolve(Game)
                                }
                                return reject({GameAlreadyExchanging: true})
                            })
                    })
                    .then(Game => {
                        const game1Id = Game.get("game_id");
            
                        return new Promise((resolve) => {
                            //Saves game in exchanging table (games_exchanging)
                            return GamesExchanging
                            .forge({
                                list_id: user1,
                                user_1: user1,
                                user_2: user2,
                                game_1: game1Id,
                                game_2: game2,
                                status: "active",
                                time: time
                            })
                            .save(null, {method: "insert", transacting: t})
                            .then(() => {
                                return resolve(game1Id);
                            })
                        })
                    })  
                    .then(game1Id => {                    
                        //Updates game status in gameslist
                        return GamesInList
                            .where({game_id: game1Id, list_id: user1})
                            .fetch({transacting: t})
                            .then(Game => {
                                if (Game) {
                                    return Game
                                        .save({status: "exchanging"}, {patch: true, transacting: t})
                                        .then(() => {
                                           return res.json({gameSetToExchange: true})
                                        })
                                }
                        })
                       
                    })
                })
                .catch(() => {
                    return res.status(500).json({internalError: true})
                })

});


module.exports = router; 
