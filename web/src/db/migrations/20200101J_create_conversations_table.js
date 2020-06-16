exports.up = function (knex) {
  return knex.schema
    .createTable("conversations", table => {
      table.increments("id");
      table.string("time").defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("conversations")
};
