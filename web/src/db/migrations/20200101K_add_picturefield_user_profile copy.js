exports.up = function (knex) {
    return knex.schema
      .alterTable("user_profile", table => {
        table.string("picture").defaultTo("not selected");
      })
};
  
exports.down = function (knex) {
  return knex.schema
    .alterTable("user_profile", table => {
      table.string("picture").defaultTo("not selected");
    })
};