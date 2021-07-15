const pool = require("../databasePool")

class BuyPlaceTable {
  //admin
  static insert({ name, aguulah_place_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO buy_place(name, aguulah_place_id) VALUES($1, $2)`,
        [name, aguulah_place_id],
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
        `SELECT buy_place.*, aguulah_place.name AS aguulah_place_name FROM buy_place
         INNER JOIN aguulah_place ON aguulah_place.id = buy_place.aguulah_place_id`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }

  static update({ name, aguulah_place_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE buy_place SET name=$1, aguulah_place_id=$2 WHERE id=$3`,
        [name, aguulah_place_id, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM buy_place WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  static getWorkByProcess({ aguulah_place_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM buy_place WHERE aguulah_place_id = $1`,
        [aguulah_place_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = BuyPlaceTable
