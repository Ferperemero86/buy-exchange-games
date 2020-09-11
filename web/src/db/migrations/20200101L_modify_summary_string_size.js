exports.up = function (knex) {
    return knex.schema.raw('ALTER TABLE games_content ALTER COLUMN summary TYPE VARCHAR(10000)');
};
  
exports.down = function (knex) {
  return knex.schema.raw('ALTER TABLE games_content ALTER COLUMN summary TYPE VARCHAR(10000)');
};