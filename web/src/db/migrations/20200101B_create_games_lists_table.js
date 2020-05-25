exports.up = function (knex) {
    return knex.schema
        .createTable("games_lists", table => {
            table.integer("id").notNullable();
            table.string("list_name");
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_lists")
};

