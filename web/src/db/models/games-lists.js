const bookshelf = require("../bookshelf");

const GamesLists = bookshelf.Model.extend({
    tableName: "games_lists"
});

module.exports = GamesLists;