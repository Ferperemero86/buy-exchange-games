const bookshelf = require("../bookshelf");

const AdminUser = bookshelf.model("AdminUser", {
  tableName: "users"
});

module.exports = AdminUser;
