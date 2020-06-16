exports.up = function (knex) {
    return knex.schema
      .createTable("users_messages", table => {
        table.increments("id");
        table.integer("conversation_id");
        table.integer("user_id").notNullable();
        table.string("message").defaultTo("not text");
        table.string("time").defaultTo(knex.fn.now());
      })
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTable("users_messages")
  };