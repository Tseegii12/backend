const pool = require("../databasePool")

class FieldTable {
  //admin
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO field(name) VALUES($1)`, [name], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  static getField() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM field ORDER BY name`, [], (error, response) => {
        if (error) return reject(error)
        resolve(response.rows)
      })
    })
  }

  static update({ name, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE field SET name=$1 WHERE id=$2`,
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
      pool.query(`DELETE FROM field WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  //mobile
}

module.exports = FieldTable
