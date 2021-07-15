const pool = require("../../databasePool")

class BlockTable {
  //admin
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO block(name) VALUES($1)`, [name], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM block ORDER BY name`, [], (error, response) => {
        if (error) return reject(error)
        resolve(response.rows)
      })
    })
  }

  static update({ name, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE block SET name = $1 WHERE id = $2`,
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
      pool.query(`DELETE FROM block WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  //mobile
  static getAllWithPj({ project_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT DISTINCT ON (unit.block_id) unit.block_id, block.name as block_name FROM unit
        LEFT JOIN block ON unit.block_id = block.id
        LEFT JOIN project ON unit.project_id = project.id
        LEFT JOIN floor ON unit.floor_id = floor.id
        INNER JOIN zagvar ON unit.zagvar_id = zagvar.id
        WHERE unit.project_id = $1`,
        [project_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }

  static getFloors({ zagvar_turul_id, block_id, project_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT DISTINCT ON (unit.floor_id) unit.floor_id, floor.name AS floor_name FROM unit
        LEFT JOIN block ON unit.block_id = block.id
        LEFT JOIN project ON unit.project_id = project.id
        LEFT JOIN floor ON unit.floor_id = floor.id
        INNER JOIN zagvar ON unit.zagvar_id = zagvar.id
        WHERE zagvar_turul_id = $1 AND block_id = $2 AND project_id = $3`,
        [zagvar_turul_id, block_id, project_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = BlockTable
