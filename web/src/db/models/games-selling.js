const bookshelf = require("../bookshelf");

const GamesSelling = bookshelf.model("GamesSelling", {
    tableName: "games_selling"
});

module.exports = GamesSelling;