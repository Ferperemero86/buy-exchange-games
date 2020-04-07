const router = require("express").Router();
const users = require("../controllers/users");
const games = require("../controllers/games");

router.use(users);
router.use(games);

module.exports = router;
