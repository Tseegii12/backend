const pool = require("../../databasePool")

class WorkTable {
  //admin
  static insert({ name, work_type_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO work(name, work_type_id) VALUES($1, $2)`,
        [name, work_type_id],
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
        `SELECT work.*, work_type.name AS work_type_name FROM work
         INNER JOIN work_type ON work_type.id = work.work_type_id ORDER BY name, work_type_name`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }

  static update({ name, work_type_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE work SET name=$1, work_type_id=$2 WHERE id=$3`,
        [name, work_type_id, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM work WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  static getAllWithPName() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT work.*, work_type.name AS type_name FROM work INNER JOIN work_type ON work.work_type_id = work_type.id`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }

  static getWorkByProcess({ work_type_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM work WHERE work_type_id = $1`,
        [work_type_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = WorkTable
