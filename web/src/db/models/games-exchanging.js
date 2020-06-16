const bookshelf = require("../bookshelf");

const GamesExchanging = bookshelf.model("GamesExchanging", {
    tableName: "games_exchanging"
});

module.exports = GamesExchanging;