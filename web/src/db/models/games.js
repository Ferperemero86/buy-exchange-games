const bookshelf = require("../bookshelf");

const Lists = bookshelf.Model.extend({
    tableName: "lists"
});

const GamesInList = bookshelf.Model.extend({
    tableName: "games_in_list"
});

module.exports = Lists;
module.exports = GamesInList;
