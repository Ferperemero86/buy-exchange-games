const bookshelf = require("../bookshelf");

const Conversations = bookshelf.model("GamesExchangingProposals", {
  tableName: "games_exchanging_proposals",
  proposals() {
    return this.hasOne("GamesExchanging", "id", "id")
  },
  gameContent2() {
    return this.belongsTo("GamesContent", "game_2", "id")
  }
});

module.exports = Conversations;