const pool = require("../../databasePool")

class UnitTable {
  //admin
  static insert({ name, block_id, zagvar_id, m2, project_id, floor_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO unit(name, block_id, zagvar_id, m2, project_id, floor_id) VALUES($1, $2, $3, $4, $5, $6)`,
        [name, block_id, zagvar_id, m2, project_id, floor_id],
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
        `SELECT unit.*, block.name AS block_name, project.name AS pj_name, floor.name AS floor_name, table1.name AS zagvar_name,
        table1.zagvar_turul_name FROM unit
        LEFT JOIN block ON unit.block_id = block.id
        LEFT JOIN project ON unit.project_id = project.id
        LEFT JOIN floor ON unit.floor_id = floor.id
        INNER JOIN (
          SELECT zagvar.*, zagvar_turul.name as zagvar_turul_name FROM zagvar
          INNER JOIN zagvar_turul ON zagvar.zagvar_turul_id = zagvar_turul.id) AS table1
        ON unit.zagvar_id = table1.id`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static update({ name, block_id, zagvar_id, m2, project_id, floor_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE unit SET name=$1, block_id=$2, zagvar_id=$3, m2=$4, project_id=$5, floor_id=$6 WHERE id = $7`,
        [name, block_id, zagvar_id, m2, project_id, floor_id, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM unit WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }

  //mobile
  static getAllByTurulBlock({ zagvar_turul_id, block_id, project_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT unit.*, block.name AS block_name, project.name AS pj_name,
        floor.name AS floor_name, zagvar.name AS zagvar_name, zagvar.zagvar_turul_id AS zagvar_turul_id FROM unit
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
  static getAllByTurulBlockFloor({ zagvar_turul_id, block_id, project_id, floor_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT unit.*, block.name AS block_name, project.name AS pj_name,
        floor.name AS floor_name, zagvar.name AS zagvar_name, zagvar.zagvar_turul_id AS zagvar_turul_id FROM unit
        LEFT JOIN block ON unit.block_id = block.id
        LEFT JOIN project ON unit.project_id = project.id
        LEFT JOIN floor ON unit.floor_id = floor.id
        INNER JOIN zagvar ON unit.zagvar_id = zagvar.id
        WHERE zagvar_turul_id = $1 AND block_id = $2 AND project_id = $3 AND floor_id = $4`,
        [zagvar_turul_id, block_id, project_id, floor_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getAllByManager({ manager_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT DISTINCT ON (table1.id) table1.id as table1_unit_id, table1.block_id, table1.zagvar_id,
        table1.floor_id, table1.m2, table1.project_id, table1.name, table1.block_name,
        table1.pj_name, table1.floor_name, table1.zagvar_name, process_work.* FROM (
          SELECT unit.*, block.name AS block_name, project.name AS pj_name,
          floor.name AS floor_name, zagvar.name AS zagvar_name FROM unit
          LEFT JOIN block ON unit.block_id = block.id
          LEFT JOIN project ON unit.project_id = project.id
          LEFT JOIN floor ON unit.floor_id = floor.id
          INNER JOIN zagvar ON unit.zagvar_id = zagvar.id) AS table1 
        INNER JOIN process_work ON process_work.unit_id = table1.id
        WHERE manager_id = $1`,
        [manager_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = UnitTable
