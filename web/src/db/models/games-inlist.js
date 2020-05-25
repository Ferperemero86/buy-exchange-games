const bookshelf = require("../bookshelf");

const GamesInList = bookshelf.Model.extend({
    tableName: "games_in_list"
});

module.exports = GamesInList;

