const bookshelf = require("../bookshelf");

const GamesContent = bookshelf.Model.extend({
    tableName: "games_content"
});

module.exports = GamesContent;