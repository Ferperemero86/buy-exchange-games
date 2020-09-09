const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });

const GamesContent = require("../db/models/games-content");


router.post("/game",
            jsonParser,
            (req, res) => {
                const {gameId} = req.body;

                return GamesContent
                    .where({id: gameId})
                    .fetch({require: false})
                    .then(game => {
                        if (!game) { return res.json({gameDoesNotExist: true}) }
                        return res.json({game});
                    })
                    .catch(() => {
                        return res.json({internalError: true})
                    })
                        
})


module.exports = router;