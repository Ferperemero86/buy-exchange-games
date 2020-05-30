exports.up = function (knex) {
    return knex.schema
      .createTable("user_profile", table => {
        table.integer("id").notNullable();
        table.string("nickName").notNullable();
        table.string("country").notNullable();
        table.string("city").notNullable();
        table.string("time").defaultTo(knex.fn.now());
      })
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTable("user_profile")
  };