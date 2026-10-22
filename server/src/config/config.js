// Used by both the app and sequelize-cli (migrations / seeders).
const { db } = require("./env");

const base = {
  username: db.username,
  password: db.password,
  database: db.database,
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false,
  // Remember which seeders already ran, so `db:seed:all` is safe to run again.
  seederStorage: "sequelize",
};

if (db.dialect === "mysql") {
  base.timezone = db.timezone;
}
if (db.dialect === "sqlite") {
  base.storage = db.storage || "library.sqlite";
}

module.exports = {
  development: base,
  test: base,
  production: base,
};
