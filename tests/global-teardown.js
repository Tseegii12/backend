const Knex = require("knex")

const database = "test_billadb"

module.exports = async () => {
  const knex = Knex({
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      host: process.env.TEST_DB_HOST,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: __dirname + "/../db/migrations",
    },
  })

  try {
    await knex.raw(`DROP DATABASE IF EXISTS ${database}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
