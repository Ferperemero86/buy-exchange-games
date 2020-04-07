const path = require("path");

const config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.join(__dirname, "src/db/migrations"),
    tableName: "knex_migrations",
  },
};

module.exports = config;
