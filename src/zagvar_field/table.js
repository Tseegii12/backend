const pool = require("../databasePool")

class ZagvarFieldTable {
  //admin
  static insert({ zagvar_id, field_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO zagvar_field(zagvar_id, field_id) VALUES($1, $2)`,
        [zagvar_id, field_id],
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
        `SELECT zagvar_field.*, table1.name AS zagvar_name, table1.turul_name, field.name AS field_name FROM zagvar_field
        INNER JOIN (
          SELECT zagvar.*, zagvar_turul.name AS turul_name FROM zagvar
          INNER JOIN zagvar_turul ON zagvar.zagvar_turul_id = zagvar_turul.id) AS table1
          ON zagvar_field.zagvar_id = table1.id
        INNER JOIN field ON zagvar_field.field_id = field.id`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static update({ zagvar_id, field_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE zagvar_field SET zagvar_id=$1, field_id=$2 WHERE id=$3`,
        [zagvar_id, field_id, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM zagvar_field WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  //mobile
  static getAllByZagvar({ zagvar_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT zagvar_field.*, zagvar.name AS zagvar_name, field.name AS field_name FROM zagvar_field
        INNER JOIN zagvar ON zagvar_field.zagvar_id = zagvar.id
        INNER JOIN field ON zagvar_field.field_id = field.id
        WHERE zagvar_id = $1`,
        [zagvar_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getCount({ zagvar_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT COUNT(*) FROM zagvar_field WHERE zagvar_id = $1`,
        [zagvar_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows[0])
        }
      )
    })
  }
}

module.exports = ZagvarFieldTable
