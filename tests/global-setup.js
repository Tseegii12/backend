require("dotenv").config({ path: ".env.test" })

const Knex = require("knex")
const database = "test_billadb"

// Create the data
async function createTestDatabase() {
  const knex = Knex({
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: __dirname + "/../db/migrations",
    },
  })

  try {
    await knex.raw(`DROP DATABASE IF EXISTS ${database}`)
    await knex.raw(`CREATE DATABASE ${database}`)
  } catch (error) {
    throw new Error(error)
  } finally {
    await knex.destroy()
  }
}

// Seed the database with schema and data
async function seedTestDatabase() {
  const knex = Knex({
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    },
    migrations: {
      directory: __dirname + "/../db/migrations",
    },
  })

  try {
    await knex.migrate.latest()
    // await knex.seed.run()
  } catch (error) {
    throw new Error(error)
  } finally {
    await knex.destroy()
  }
}

module.exports = async () => {
  try {
    await createTestDatabase()
    await seedTestDatabase()
    console.log("Test database created successfully")
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
