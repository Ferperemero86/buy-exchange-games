const router = require("express").Router();
const knex = require("../db/knex");
const axiosModule = require("../utils/APIcall");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json({ type: "application/json" });
const User = require("../db/models/user");
const userAuthentication = require("../authentication");
const {
    GenericError,
    ListDoesNotExistError,
    ListAlreadyExistsError } = require("./errors");

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
                    if (result.length > 0) {
                        reject(new ListAlreadyExistsError())
                    }
                    resolve()
                })
        })
            .then(result => {
                knex("lists")
                    .insert({ user_id: userId, list_name: listName })
                    .then(result => {
                        res.json({ listCreated: true, listName })
                    })
            })
            .catch(err => {
                res.json({ err })
            })
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
                const id = gameDetails.id;
                const platform = gameDetails.platform;
                const name = nameString.replace("'", "");

                return new Promise((resolve, reject) => {
                    if (response.length < 1) {
                        reject(new ListDoesNotExistError());
                    }
                    const listId = response[0].id;

                    knex("games_in_list")
                        .where({
                            game_id: gameDetails.id,
                            list_id: listId
                        })
                        .then(result => {
                            //if (result.length < 1) {
                            knex("games_in_list")
                                .insert({
                                    "game_id": id,
                                    "list_id": listId,
                                    "platform": platform,
                                    "name": name,
                                    "cover": cover
                                })
                                .then(result => {
                                    resolve(result);
                                })
                            // } else {
                            //reject(new GameAlreadyExistsError())
                            // }
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

        knex("lists")
            .where("user_id", userId)
            .then(response => {
                return new Promise((resolve, reject) => {
                    if (response.length > 0) {
                        resolve(response[0])
                    }
                    reject(new ListDoesNotExistError())
                })
            })
            .then(result => {
                const listId = result.id;
                const listName = result.list_name;

                knex
                    .select("lists.list_name", "games_in_list.game_id", "games_in_list.list_id", "games_in_list.platform", "games_in_list.name", "games_in_list.cover")
                    .from('games_in_list')
                    .leftJoin('lists', 'lists.id', 'games_in_list.list_id')
                    .where({ list_id: listId })
                    .then(response => {
                        res.json({
                            gamesList: response,
                            listCreated: true,
                            listName
                        })
                    })

            })
            .catch(err => {
                res.json({ err })
            });
    });

router.post("/deletelist",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;

        knex("lists")
            .where("user_id", userId)
            .del()
            .then(response => {
                res.json({ listDeleted: true });
            })
            .catch(err => {
                res.json({ err: new GenericError() })
            })
    })

router.post("/editlistname",
    jsonParser,
    userAuthentication,
    acl(User, "save"),
    (req, res) => {
        const userId = req.user.id;
        const name = req.body.dataContent;

        knex("lists")
            .where("user_id", userId)
            .update({ list_name: name })
            .then(response => {
                res.json({ listNameUpdated: name })
            })
            .catch(err => {
                res.json({ err: new GenericError() })
            })
    })


module.exports = router;
