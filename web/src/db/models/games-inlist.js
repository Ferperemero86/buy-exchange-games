const bookshelf = require("../bookshelf");

const GamesInList = bookshelf.model("GamesInList", {
    tableName: "games_in_list"
});

module.exports = GamesInList;

