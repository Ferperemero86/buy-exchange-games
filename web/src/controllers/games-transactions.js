const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
//const userAuthentication = require("../authentication");
//const knex = require("../db/knex");
//const Bookshelf = require("../db/bookshelf");

//const acl = require("./acl");
//const validation = require("../validation");

const GamesSelling = require("../db/models/games-selling");


router.post("/gamesselling",
            jsonParser,
            (req, res) => {
                const userId = req.body ? req.body.userId : null;

                return GamesSelling
                    .query("where", "list_id", "<>", userId)
                    .fetchAll()
                    .then(games => {
                        return res.json({games})
                    })
                    .catch(()=> {
                
                    })
        
})

module.exports = router;
