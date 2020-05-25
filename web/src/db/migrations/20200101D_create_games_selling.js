exports.up = function (knex) {
    return knex.schema
        .createTable("games_selling", table => {
            table.increments("id");
            table.integer("game_id").notNullable();
            table.integer("list_id").notNullable();
            table.integer("price").notNullable();
            table.string("currency").notNullable();
            table.string("condition").notNullable();
            table.string("description").notNullable();
            table.string("time");
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_selling")
};
