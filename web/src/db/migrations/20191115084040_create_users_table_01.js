exports.up = function (knex) {
  return knex.schema
    .createTable("users", table => {
      table.increments("id");
      table.string("email");
      table.string("password");
      table.boolean("isAdmin").default(false);
    })
    .createTable("lists", table => {
      table.increments("id");
      table.integer("user_id");
      table.string("name");
    })
    .createTable("games_in_list", table => {
      table.increments("id");
      table.integer("list_id");
      table.string("name");
      table.string("cover");
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
    .dropTable("lists")
};
