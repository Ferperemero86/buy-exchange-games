const bookshelf = require("../bookshelf");

const GamesContent = bookshelf.model("GamesContent", {
    tableName: "games_content"
});

module.exports = GamesContent;