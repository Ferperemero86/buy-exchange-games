const bookshelf = require("../bookshelf");

const UserProfile = bookshelf.Model.extend({
  tableName: "user_profile"
});

module.exports = UserProfile;
