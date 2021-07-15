const { Pool } = require("pg")
const databaseConfiguration = require("./secrets/databaseConfiguration")

const pool = new Pool({
  ...databaseConfiguration,
  connectionTimeoutMillis: 2000,
  idleTimeoutMillis: 30000,
  max: 10,
})

module.exports = pool
