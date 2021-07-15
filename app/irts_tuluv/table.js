const pool = require("../../databasePool")

class IrtsTuluvTable {
  //admin
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO irts_tuluv(name) VALUES($1)`, [name], (error, response) => {
        if (error) {
          return reject(error)
        }
        resolve({ message: "success" })
      })
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM irts_tuluv`, [], (error, response) => {
        if (error) {
          return reject(error)
        }
        resolve(response.rows)
      })
    })
  }
}

module.exports = IrtsTuluvTable
