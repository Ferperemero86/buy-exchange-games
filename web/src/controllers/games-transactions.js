const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const {fetchApiLocationData} = require("../utils/API");
//const userAuthentication = require("../authentication");
const knex = require("../db/knex");
//const Bookshelf = require("../db/bookshelf");

//const acl = require("./acl");
//const validation = require("../validation");

const GamesSelling = require("../db/models/games-selling");
const UserProfile = require("../db/models/user-profile");

router.post("/usersgames",
            jsonParser,
            (req, res) => {
                const userId = req.body.userId ? req.body.userId : 0;
                const countryName = req.body.country ? req.body.country : "";
                const cityName = req.body.city ? req.body.city : "";
                let query = knex("user_profile")
                                .select("user_profile.country", "games_content.name", "games_content.cover", 
                                        "games_content.platform", "games_selling.id", "games_selling.game_id", 
                                        "games_selling.price", "games_selling.currency", "games_selling.condition", 
                                        "games_selling.description")
                                .join("games_selling", "games_selling.list_id", "=", "user_profile.id")
                                .join("games_content", "games_content.id", "=", "games_selling.game_id");
                
                return new Promise((resolve, reject) => {
                    if (!userId) {
                        if (countryName === "" && cityName === "") {
                            return reject({locationsEmpty: true})
                        }
                        if (countryName !== "" && cityName === "") {
                            query.where("country", countryName)
                        }
                        if (countryName !== "" && cityName !== "") {
                            query.where("country", countryName)
                            query.andWhere("city", cityName)
                        }

                        query.then(games => {
                            return res.json({games});
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
    
                        if (country !== "" && city === "not selected") {
                            query.whereNot("user_profile.id", userId)
                            query.andWhere("country", country)
                            return resolve({country});
                        }
                        if (country !== "" && city !== "not selected") {
                            query.whereNot("user_profile.id", userId)
                            query.andWhere("country", country)
                            query.andWhere("city", city)
                            return resolve({country, city});
                        }
                    }) 
                        
                })
                .then(locations => {
                    query.then(games => {
                        if (locations.country && !locations.city) {
                            return res.json({games, countryName: locations.country});
                        }
                        if (locations.country && locations.city) {
                            return res.json({games, countryName: locations.country, city: locations.city});
                        }
                    })
                })
                .catch(err=> {
                    if (err && err.locationsEmpty) { return res.status(400).json(err) }
                    return res.status(500).json(err);
                })
        
})

router.post("/getlocations", 
            jsonParser,
            async (req, res) => {
                const locationUrl = req.body.locationUrl;
                const locations = await fetchApiLocationData(locationUrl);
                
                return res.json({locations})
});

router.post("/usersselling/search",
            jsonParser,
            async (req) => {
                const query = req.body.query;
                console.log("QUERY", query);
                
                return GamesSelling
                    .fetchAll()
                    .then(result => {
                        console.log("RESULT", result)
                    })
                    .catch(err => {
                        console.log(err)
                    })
});

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
