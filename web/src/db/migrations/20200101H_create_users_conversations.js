exports.up = function (knex) {
    return knex.schema
      .createTable("users_conversations", table => {
        table.integer("conversation_id").notNullable();
        table.integer("user_id").notNullable();
      })
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTable("users_conversations")
  };