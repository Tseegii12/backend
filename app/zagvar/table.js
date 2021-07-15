const pool = require("../../databasePool")

//admin
class ZagvarTable {
  static insert({ name, zagvar_turul_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO zagvar(name, zagvar_turul_id) VALUES($1, $2)`,
        [name, zagvar_turul_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT zagvar.*, zagvar_turul.name as turul_name FROM zagvar INNER JOIN zagvar_turul ON zagvar.zagvar_turul_id = zagvar_turul.id ORDER BY turul_name, name`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static update({ name, zagvar_turul_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE zagvar SET name=$1, zagvar_turul_id=$2 WHERE id =$3`,
        [name, zagvar_turul_id, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM zagvar WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
}

module.exports = ZagvarTable
