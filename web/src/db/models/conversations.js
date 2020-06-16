const bookshelf = require("../bookshelf");

const Conversations = bookshelf.model("Conversations", {
  tableName: "conversations",
  recipient() {
    return this.hasMany("UsersConversations", "conversation_id", "id");
  },
  users() {
    return this.hasMany("UsersConversations", "conversation_id", "id");
  }
});

module.exports = Conversations;
