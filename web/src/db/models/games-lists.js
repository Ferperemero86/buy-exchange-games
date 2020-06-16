const bookshelf = require("../bookshelf");

const GamesLists = bookshelf.model("GamesLists", {
    tableName: "games_lists"
});

module.exports = GamesLists;