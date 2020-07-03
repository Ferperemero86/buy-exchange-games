const bookshelf = require("../bookshelf");

const Conversations = bookshelf.model("GamesSellingProposals", {
  tableName: "games_selling_proposals"
});

module.exports = Conversations;