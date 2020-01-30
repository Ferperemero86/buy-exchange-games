exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments("id");
    table.string("email");
    table.string("password");
    table.boolean("isAdmin").default(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
