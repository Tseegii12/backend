const pool = require("../../databasePool")

//admin
class ZagvarTurulTable {
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO zagvar_turul(name) VALUES($1)`,
        [name],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM zagvar_turul`, [], (error, response) => {
        if (error) return reject(error)
        resolve(response.rows)
      })
    })
  }
}

module.exports = ZagvarTurulTable
