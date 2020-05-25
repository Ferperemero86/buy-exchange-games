exports.up = function (knex) {
    return knex.schema
        .createTable("games_content", table => {
            table.increments("id").notNullable();
            table.string("name").notNullable();
            table.string("platform").notNullable();
            table.string("cover");
            table.string("summary", 1000);
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("games_content")
};
