const bookshelf = require("../bookshelf");

const UsersMessages = bookshelf.model("UsersMessages", {
  tableName: "users_messages"
});

module.exports = UsersMessages;
