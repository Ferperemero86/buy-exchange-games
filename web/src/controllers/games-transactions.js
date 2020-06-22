const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
//const {fetchApiLocationData} = require("../utils/API");
//const userAuthentication = require("../authentication");
const knex = require("../db/knex");
//const Bookshelf = require("../db/bookshelf");

//const acl = require("./acl");
//const validation = require("../validation");

//const GamesSelling = require("../db/models/games-selling");
const UserProfile = require("../db/models/user-profile");

router.post("/usersgames",
            jsonParser,
            (req, res) => {
                const userId = req.body.userId ? req.body.userId : 0;
                const countryName = req.body.country ? req.body.country : "";
                const cityName = req.body.city ? req.body.city : "";
                let textSearch = req.body.textSearch ? req.body.textSearch : "";
                const type = req.body.type ? req.body.type : "selling";
                let query;


                const groupExchangingGames = (games) => {
                    let gamesArray = [];
                    let currentGameId = 0;

                    if (type === "exchanging" && games && Array.isArray(games)) {
                        games.map(game => {

                            if (currentGameId !== game.id) {
                                const filteredGames = games.filter(item => { return item.id === game.id });

                                currentGameId = game.id;
                                gamesArray.push(filteredGames);
                            }
                        })
                    }
                    return gamesArray;
                }
            
                //Converts search in lowcase format
                if (textSearch !== "") {
                    textSearch = textSearch.toLowerCase();
                }
                console.log("TYPE", type);
                if (type === "exchanging") {
                    query = knex("user_profile")
                                .select("user_profile.country", "user_profile.id", "user_profile.nickName", "games_content.name", "games_content.cover", 
                                        "games_content.platform", "games_exchanging.id", "games_exchanging.list_id", 
                                        "games_exchanging.game_1", "games_exchanging.game_2")
                                .join("games_exchanging", "games_exchanging.list_id", "=", "user_profile.id")
                                .join("games_content", function() {
                                    this.on(function() {
                                        this.on("games_content.id", "=", "games_exchanging.game_1")
                                        this.orOn("games_content.id", "=", "games_exchanging.game_2")
                                    })
                    });
                } else {
                    query = knex("user_profile")
                                .select("user_profile.country", "user_profile.id", "user_profile.nickName", "games_content.name", "games_content.cover", 
                                        "games_content.platform", "games_selling.game_id", 
                                        "games_selling.price", "games_selling.currency", "games_selling.condition", 
                                        "games_selling.description")
                                .join("games_selling", "games_selling.list_id", "=", "user_profile.id")
                                .join("games_content", "games_content.id", "=", "games_selling.game_id");
                }

                return new Promise((resolve, reject) => {
                    if (!userId) {
                        if (countryName === "" && cityName === "") {
                            return reject({locationsEmpty: true});
                        }
                        if (countryName !== "" && cityName === "") {
                            query.where("country", countryName);
                        }
                        if (countryName !== "" && cityName !== "") {
                            console.log("CITY SELECTED!", cityName);
                            query.where("country", countryName);
                            query.andWhere("city", cityName);
                        }
                        if(textSearch !== "") {
                            query.andWhere("games_content.name", "like", `%${textSearch}%`);
                        }

                        query.then(games => {
                            let gamesArray;
                            if (type === "exchanging") {
                                const gamesExchanging = groupExchangingGames(games);
                                gamesArray = gamesExchanging;
                            } else {
                                gamesArray = games;
                            }
                            console.log("TESTTT", gamesArray)
                            return res.json({games: gamesArray});
                        })

                    } else {
                        UserProfile
                            .where({id: userId})
                            .fetch({require: false})
                            .then(User => {
                                const country = User.get("country");
                                const city = User.get("city");

                                if (User) { return resolve({country, city}) }

                                return reject({internalError: true})
                            })
                    }
                })
                .then(locations => {
                    return new Promise((resolve) => {
                        const country = countryName !== "" ? countryName : locations.country;
                        const city = cityName !== "" ? cityName : locations.city;

                        query.whereNot("user_profile.id", userId);
                        
                        if(textSearch !== "") {
                            query.andWhere("games_content.name", "like", `%${textSearch}%`);
                        }
                        if (country !== "" && city === "not selected") {
                            query.andWhere("country", country)
                            return resolve({country});
                        }
                        if (country !== "" && city !== "not selected") {
                            query.andWhere("country", country)
                            query.andWhere("city", city)
                            return resolve({country, city});
                        }
                    }) 
                        
                })
                .then(locations => {
                    query.then(games => {
                        let gamesArray;
                        if (type === "exchanging") {
                            const gamesExchanging = groupExchangingGames(games);
                            gamesArray = gamesExchanging;
                        } else {
                            gamesArray = games;
                        }

                        if (locations.country && !locations.city) {
                            return res.json({games: gamesArray,
                                             countryName: locations.country});
                        }
                        if (locations.country && locations.city) {
                            return res.json({games: gamesArray, 
                                            countryName: locations.country, 
                                            city: locations.city});
                        }
                    })
                })
                .catch(err=> {
                    if (err && err.locationsEmpty) { return res.status(400).json(err) }
                    return res.status(500).json(err);
                })
        
})

router.post("/usersselling/game",
            jsonParser,
            async (req, res) => {
                const id = req.body.id;

                knex("games_selling")
                    .select("games_content.name", "games_content.cover", "games_content.platform", "games_selling.id", "games_selling.game_id", "games_selling.price", "games_selling.currency", "games_selling.condition", "games_selling.description")
                    .where({"games_selling.id": id})
                    .join("games_content", "games_content.id", "=", "games_selling.game_id")
                    .then(games => {
                        return res.json({games})
                }) 
                .catch(err=> {
                    console.log(err);
                })
                
});


module.exports = router;
