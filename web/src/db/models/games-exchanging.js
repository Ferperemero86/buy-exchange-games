const bookshelf = require("../bookshelf");

const GamesExchanging = bookshelf.Model.extend({
    tableName: "games_exchanging"
});

module.exports = GamesExchanging;