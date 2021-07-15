const pool = require("../../databasePool")

class FloorTable {
  //admin
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO floor(name) VALUES($1)`, [name], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(`select*from floor order by name desc`, [], (error, response) => {
        if (error) return reject(error)
        resolve(response.rows)
      })
    })
  }
  static update({ name, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE floor SET name = $1 WHERE id = $2`,
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
      pool.query(`DELETE FROM floor WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
}

module.exports = FloorTable
