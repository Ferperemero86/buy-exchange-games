const bookshelf = require("../bookshelf");

const GamesExchanging = bookshelf.model("GamesExchanging", {
    tableName: "games_exchanging",
    gameContent1() {
        return this.belongsTo("GamesContent", "game_1", "id")
    },
    userProfile1() {
        return this.belongsTo("UserProfile", "user_1", "id")
    },
    userProfile2() {
        return this.belongsTo("UserProfile", "user_2", "id")
    }
});

module.exports = GamesExchanging;