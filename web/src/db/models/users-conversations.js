const bookshelf = require("../bookshelf");

const UsersConversations = bookshelf.model("UsersConversations", {
  tableName: "users_conversations",
  users() {
    return this.hasMany("UsersConversations", "conversation_id", "conversation_id")
  },
  messages() {
    return this.hasMany("UsersMessages", "conversation_id", "conversation_id" )
  }
})

module.exports = UsersConversations;
