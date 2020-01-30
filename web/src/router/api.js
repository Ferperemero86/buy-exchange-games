const router = require("express").Router();
const users = require("../controllers/users");

router.use(users);

module.exports = router;
