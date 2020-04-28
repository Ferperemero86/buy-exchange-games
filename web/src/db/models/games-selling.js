const bookshelf = require("../bookshelf");

const GamesSelling = bookshelf.Model.extend({
    tableName: "games_selling"
});

module.exports = GamesSelling;