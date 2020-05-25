const router = require("express").Router();
const users = require("../controllers/users");
const gamesInList = require("../controllers/games-inlist");
const gamesLists = require("../controllers/games-lists");
const gamesTransactions = require("../controllers/games-transactions");

router.use(users);
router.use(gamesInList);
router.use(gamesLists);
router.use(gamesTransactions);

module.exports = router;
