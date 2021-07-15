const pool = require("../databasePool")

class MaterialTypeTable {
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO material_type(name) VALUES($1)`,
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
      pool.query(`SELECT * FROM material_type ORDER BY name`, [], (error, response) => {
        if (error) return reject(error)
        resolve(response.rows)
      })
    })
  }
  static update({ name, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE material_type SET name=$1 WHERE id = $2`,
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
      pool.query(`DELETE FROM material_type WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
}

module.exports = MaterialTypeTable
