const bookshelf = require("../bookshelf");

const UserProfile = bookshelf.model("UserProfile", {
  tableName: "user_profile",
  profiles() {
    return this.belongsTo("User", "id", "id")
  }
});

module.exports = UserProfile;
