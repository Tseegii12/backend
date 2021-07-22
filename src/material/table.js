const pool = require("../databasePool")

class MaterialTable {
  //admin
  static insert({ name, material_unit, code, material_type_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO material(name, material_unit, code, material_type_id) VALUES($1, $2, $3, $4)`,
        [name, material_unit, code, material_type_id],
        (error, response) => {
          if (error) return reject(error)

            resolve({ message: "success" })
        }
      )
    })
  }

  static saveUsedCode(code) {
      return new Promise((resolve, reject) => {
          pool.query(`INSERT INTO used_material_codes(code) VALUES ($1)`, [code], (error, res) => {
              if (error) return reject(error)

              resolve({ response: { success: true, message: "Материалыг хадгаллаа." } })
          })
      })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT material.*, material_type.name as type_name, hemjee.name as hemjih_negj FROM material
        INNER JOIN material_type ON material.material_type_id = material_type.id
        INNER JOIN hemjee ON material.material_unit = hemjee.id ORDER BY name, code, type_name`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }

  static update({ name, material_unit, code, material_type_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE material SET name=$1, material_unit=$2, code=$3, material_type_id=$4 WHERE id=$5`,
        [name, material_unit, code, material_type_id, id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM material WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
  //mobile

  static generateCode() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT public.new_material_code()", [], (error, result) => {
        if (error) reject(error)

        resolve(result.rows)
      })
    })
  }
}

module.exports = MaterialTable
