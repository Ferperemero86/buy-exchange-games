const bookshelf = require("../bookshelf");

const User = bookshelf.Model.extend({
  tableName: "users",
  getAdmin: function(user) {
    if (user) {
      return user.get("isAdmin");
    } else {
      return null;
    }
  },
});

module.exports = User;
