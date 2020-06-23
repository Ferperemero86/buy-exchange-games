const bookshelf = require("../bookshelf");

const GamesSelling = bookshelf.model("GamesSelling", {
    tableName: "games_selling",
    content() {
        return this.hasOne("GamesContent", "id", "game_id");
    }
});

module.exports = GamesSelling;