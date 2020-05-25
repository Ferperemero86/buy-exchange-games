exports.up = function (knex) {
  return knex.schema
    .createTable("users", table => {
      table.increments("id");
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.boolean("isAdmin").default(false).notNullable();
      table.string("time");
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
};
