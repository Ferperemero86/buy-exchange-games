const bookshelf = require("../bookshelf");

const User = bookshelf.model("User", {
  tableName: "users",
  conversations() {
    return this.hasMany("UsersConversations", "user_id", "id")
  }
});

module.exports = User;
