exports.up = function (knex) {
    return knex.schema
        .createTable("games_selling_proposals", table => {
            table.increments("id").notNullable();
            table.integer("price").notNullable();
            table.integer("recipient_id").notNullable();
            table.integer("sender_id").notNullable();
            table.timestamp("time").defaultTo(knex.fn.now());
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_selling_proposals")
};
