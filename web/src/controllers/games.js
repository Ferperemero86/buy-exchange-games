const router = require("express").Router();
const knex = require("../db/knex");
const axiosModule = require("../utils/APIcall");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const User = require("../db/models/user");
const userAuthentication = require("../authentication");
const { InsertGameInListError, ListDoesNotExistError, ListAlreadyExistsError } = require("./errors");

const validation = require("../validation");

const acl = require("../controllers/acl");

router.post("/games/ps4", jsonParser, (req, res) => {
    const query = req.body.dataContent;

    axiosModule.apiCall("games", "GET", query)
        .then(response => {
            res.json({ gamesContent: response.data })
        })
});

router.post("/games/xbox", jsonParser, (req, res) => {
    const query = req.body.dataContent;

    axiosModule.apiCall("games", "GET", query)
        .then(response => {
            console.log(response);
            res.json({ gamesContent: response.data })
        })
});

router.post("/games/pc", jsonParser, (req, res) => {
    const query = req.body.dataContent;

    axiosModule.apiCall("games", "GET", query)
        .then(response => {
            res.json({ gamesContent: response.data })
        })
});

router.post("/games/details", jsonParser, (req, res) => {
    const query = req.body.dataContent;

    axiosModule.apiCall("games", "GET", query)
        .then(response => {
            console.log(response.data);
            res.json({ gameDetails: response.data })
        })
})

router.post("/createlist",
    jsonParser,
    userAuthentication,
    acl(User, "create"),
    (req, res) => {
        const listName = req.body.dataContent;
        const userId = req.user.id;

        return new Promise((resolve, reject) => {
            knex("lists")
                .where("user_id", userId)
                .then(result => {
                    console.log(result);
                    if (result.length > 0) {
                        reject(ListAlreadyExistsError())
                    }
                    resolve()
                })
        })
            .then(result => {
                knex("lists")
                    .insert({ user_id: userId, name: listName })
                    .then(result => {
                        console.log(result)
                        res.json({ listCreated: true })
                    })
            })
            .catch(err => {
                console.log(err);
            })
        knex
            .raw(`INSERT INTO lists (user_id, name) VALUES ('${userId}','${listName}')`)
            .then(result => res.send(JSON.stringify(result.rows)))
            .catch(err => console.log(err))
    });

router.post("/addgametolist",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;
        const gameDetails = req.body.gameDetails[0];

        knex("lists")
            .where("user_id", `${userId}`)
            .then(response => {
                const nameString = gameDetails.name;
                const cover = gameDetails.cover.url;
                const name = nameString.replace("'", "");

                return new Promise((resolve, reject) => {
                    if (response.length < 1) {
                        reject(new ListDoesNotExistError());
                    }
                    const listId = response[0].id;

                    knex("games_in_list")
                        .where("id", gameDetails.id)
                        .then(result => {
                            if (result.length < 1) {
                                knex("games_in_list")
                                    .insert({
                                        "id": gameDetails.id,
                                        "list_id": listId,
                                        "name": name,
                                        "cover": cover
                                    })
                                    .then(result => {
                                        resolve(result);
                                    })
                            } else {
                                reject(new GameAlreadyExistsError())
                            }
                        })
                });
            })
            .then(game => {
                res.json({ game })
            })
            .catch(error => {
                res.json({ error });
            });
    });

router.get("/getlist",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;
        //const gamesListCreated = false;
        console.log(userId);

        knex("lists")
            .where("user_id", userId)
            .then(response => {
                console.log(response);
                return new Promise((resolve, reject) => {
                    if (response.length > 0) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
            .then(result => {
                console.log("sorted");
                knex
                    .raw(`SELECT games_in_list.id, games_in_list.list_id, games_in_list.name, games_in_list.cover
                    FROM games_in_list
                    JOIN lists ON lists.id = games_in_list.list_id
                    where user_id = ${userId}`)
                    .then(response => {
                        console.log(response.rows);
                        if (!response.rows) {
                            res.json({ gamesList: "No games in list", listExists: true })
                        }
                        res.json({ gamesList: response.rows, listExists: true })
                    })
            })
            .catch(err => {
                //res.json({ error })
                console.log(err);
            });
    });

router.post("/deletelist",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        console.log("post delete");
        const userId = req.user.id;

        knex("lists")
            .where("user_id", userId)
            .del()
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err)
            })
    })


module.exports = router;
