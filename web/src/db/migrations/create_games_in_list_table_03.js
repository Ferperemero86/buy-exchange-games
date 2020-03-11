exports.up = function (knex) {
    return knex.schema
        .createTable("games_in_list", table => {
            table.increments("id");
            table.integer("list_id");
            table.string("name");
            table.string("cover");
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_in_list")
};
