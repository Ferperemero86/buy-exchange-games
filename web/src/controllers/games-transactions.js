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


router.post("/gamesselling",
            jsonParser,
            (req, res) => {
                const userId = req.user && req.user.id ? req.user.id : 0;
                const {country, city} = req.body;

                return new Promise((resolve, reject) => {
                    if (!country && !city) {
                        return reject({locationsEmpty: true})
                    }
                    return resolve();
                })
                .then(() => {
                    knex("user_profile")
                        .select("games_content.name", "games_content.cover", "games_content.platform", "games_selling.id", "games_selling.game_id", "games_selling.price", "games_selling.currency", "games_selling.condition", "games_selling.description")
                        .whereNot("user_profile.id", userId)
                        .andWhere("user_profile.country", country)
                        .join("games_selling", "games_selling.list_id", "=", "user_profile.id")
                        .join("games_content", "games_content.id", "=", "games_selling.game_id")
                        .then(games => {
                            console.log("GAMES IN SERVER", games);
                            return res.json({games})
                    }) 
                })
                .catch(err=> {
                    if (err.locationsEmpty) { return res.status(400).json(err) }
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
                console.log("ID", id);

                knex("games_selling")
                    .select("games_content.name", "games_content.cover", "games_content.platform", "games_selling.id", "games_selling.game_id", "games_selling.price", "games_selling.currency", "games_selling.condition", "games_selling.description")
                    .where({"games_selling.id": id})
                    .join("games_content", "games_content.id", "=", "games_selling.game_id")
                    .then(games => {
                        console.log("GAME DETAILS SELLING", games);
                        return res.json({games})
                }) 
                .catch(err=> {
                    console.log(err);
                })
                
});


module.exports = router;
