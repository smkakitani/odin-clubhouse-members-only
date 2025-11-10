const { Pool } = require("pg");

// Connection with DB
module.exports = new Pool({
  connectionString: process.env.CONNECTION_LOCAL_DB || process.env.DATABASE_URL
});