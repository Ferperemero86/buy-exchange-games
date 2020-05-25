exports.up = function (knex) {
    return knex.schema
        .createTable("games_in_list", table => {
            table.increments("id").notNullable();
            table.integer("list_id").notNullable();
            table.integer("game_id").notNullable();
            table.string("status").defaultTo("inList").notNullable();
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_in_list")
};
