const bookshelf = require("../bookshelf");

const Games = bookshelf.Model.extend({
    tableName: "games_in_list"
});

module.exports = Games;

