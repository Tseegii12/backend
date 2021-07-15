const pool = require("../../databasePool")

class AguulahPlaceTable {
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO aguulah_place(name) VALUES($1)`,
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
      pool.query(`SELECT * FROM aguulah_place`, [], (error, response) => {
        if (error) return reject(error)
        resolve(response.rows)
      })
    })
  }
  static update({ name, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE aguulah_place SET name = $1 WHERE id = $2`,
        [name, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM aguulah_place WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
}

module.exports = AguulahPlaceTable
