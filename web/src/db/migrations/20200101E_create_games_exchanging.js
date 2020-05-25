exports.up = function (knex) {
    return knex.schema
        .createTable("games_exchanging", table => {
            table.increments("id");
            table.integer("list_id").notNullable();
            table.integer("game_1").notNullable();
            table.integer("game_2").notNullable();
            table.integer("user_1").notNullable();
            table.integer("user_2");
            table.string("status").notNullable();
            table.string("time");
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_exchanging")
};
