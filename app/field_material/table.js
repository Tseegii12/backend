const pool = require("../../databasePool")

class FieldMaterialTable {
  static insert({ material_id, work_id, material_too, field_id, zagvar_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO field_material(material_id, work_id, material_too, field_id, zagvar_id) VALUES($1, $2, $3, $4, $5)`,
        [material_id, work_id, material_too, field_id, zagvar_id],
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
        `SELECT field_material.*, work.name AS work_name, zagvar.name AS zagvar_name, field.name AS field_name, material.name AS material_name FROM field_material
        INNER JOIN work ON field_material.work_id = work.id
        INNER JOIN zagvar ON field_material.zagvar_id = zagvar.id
        INNER JOIN material ON field_material.material_id = material.id
        LEFT JOIN field ON field_material.field_id = field.id`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static update({ material_id, work_id, material_too, field_id, zagvar_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE field_material SET material_id=$1, work_id=$2, material_too=$3, field_id=$4, zagvar_id=$5 WHERE id=$6`,
        [material_id, work_id, material_too, field_id, zagvar_id, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM field_material WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
}

module.exports = FieldMaterialTable
