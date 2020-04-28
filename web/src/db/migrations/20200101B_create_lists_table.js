exports.up = function (knex) {
    return knex.schema
        .createTable("lists", table => {
            table.integer("user_id").primary();
            table.string("list_name");
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTable("lists")
};

