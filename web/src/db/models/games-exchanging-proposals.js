const bookshelf = require("../bookshelf");

const Conversations = bookshelf.model("GamesExchangingProposals", {
  tableName: "games_exchanging_proposals"
});

module.exports = Conversations;