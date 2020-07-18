const bookshelf = require("../bookshelf");

const GamesSellingProposals = bookshelf.model("GamesSellingProposals", {
  tableName: "games_selling_proposals",
  proposals() {
    return this.hasOne("GamesSelling", "id", "id")
  }
});

module.exports = GamesSellingProposals;