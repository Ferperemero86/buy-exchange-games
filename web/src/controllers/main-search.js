const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const {fetchApiData} = require("../utils/API");

router.post("/mainsearch",
            jsonParser,
            async (req, res) => {
                const {game} = req.body;
                let games = {};

                const ps4Query = `search "${game}"; fields name, cover.url, platforms, summary; where platforms = (48); limit 10;`;
                const xboxQuery = `search "${game}"; fields name, cover.url, platforms, summary; where platforms = (49); limit 10;`;
                const pcQuery = `search "${game}"; fields name, cover.url, platforms, summary; where platforms = (48); limit 10;`;

                const ps4Games = await fetchApiData("games", "POST", ps4Query);
                const xboxGames = await fetchApiData("games", "POST", xboxQuery);
                const pcGames = await fetchApiData("games", "POST", pcQuery);
               
                games = {ps4: ps4Games, xbox: xboxGames, pc: pcGames}

                return res.json({games});
})

module.exports = router;
