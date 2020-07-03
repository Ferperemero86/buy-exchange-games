exports.up = function (knex) {
    return knex.schema
        .createTable("games_exchanging_proposals", table => {
            table.increments("id").notNullable();
            table.integer("recipient_id").notNullable();
            table.integer("sender_id").notNullable();
            table.integer("game_2").notNullable();
            table.timestamp("time").defaultTo(knex.fn.now());
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_exchanging_proposals")
};
