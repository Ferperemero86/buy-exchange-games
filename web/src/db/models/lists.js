const bookshelf = require("../bookshelf");

const Lists = bookshelf.Model.extend({
    tableName: "lists"
});

module.exports = Lists;