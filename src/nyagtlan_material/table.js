const pool = require("../../databasePool")

class NyagtlanMaterialTable {
  //admin
  static insert({ process_work_id, material_id, material_too, date, nyarav_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO nyagtlan_material(process_work_id, material_id, material_too, date, nyarav_id) VALUES($1, $2, $3, $4, $5)`,
        [process_work_id, material_id, material_too, date, nyarav_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
}

module.exports = NyagtlanMaterialTable
