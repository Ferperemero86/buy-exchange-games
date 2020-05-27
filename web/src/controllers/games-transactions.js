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
                const userId = req.body.userId ? req.body.userId : 0;
                
                //return res.json({games})
                knex("games_selling")
                    .select("games_content.name", "games_content.cover", "games_content.platform", "games_selling.id", "games_selling.game_id", "games_selling.price", "games_selling.currency", "games_selling.condition", "games_selling.description")
                    .whereRaw("games_selling.list_id <> ?", [userId])
                    .join("games_content", "games_content.id", "=", "games_selling.game_id")
                    .then(games => {
                        return res.json({games})
                }) 
                .catch(()=> {
            
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
            })

module.exports = router;
