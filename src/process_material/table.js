const pool = require("../../databasePool")

class ProcessMaterialTable {
  //admin
  static insert({ process_work_id, material_id, material_too }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO process_material(process_work_id, material_id, material_too, date) VALUES($1, $2, $3, NOW())`,
        [process_work_id, material_id, material_too],
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
        `select process_material.*, material.name as material_name,
        table1.pj_name, table1.block_name, table1.unit_name, table1.zagvar_name, table1.field_name, table1.manager_name,
        table1.work_name, table1.project_id from process_material
        inner join material on process_material.material_id = material.id
        inner join 
          ( select process_work.*,
          field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
          field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
          field_works.hemjee_name, manager.name as manager_name, admin.name as admin_name, units.name as unit_name,
      units.pj_name, units.project_id, units.block_name from process_work
          inner join (
             select field_work.*,
             work.name as work_name, field.name as field_name, zagvar.name as zagvar_name, hemjee.name as hemjee_name from field_work 
             inner join work on field_work.work_id = work.id
             inner join field on field_work.field_id = field.id
             inner join zagvar on field_work.zagvar_id = zagvar.id
             inner join hemjee on field_work.hemjih_negj_id = hemjee.id
          ) as field_works on process_work.field_work_id = field_works.id
          inner join (
             select unit.*, project.name as pj_name, block.name as block_name from unit
             inner join project on unit.project_id = project.id
             inner join block on unit.block_id = block.id) as units on process_work.unit_id = units.id
          left join users as manager on process_work.manager_id = manager.id
          left join users as admin on process_work.admin_id = admin.id )
          as table1 on process_material.process_work_id = table1.id where process_material.is_action = false`,
        [],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static update({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE process_material SET is_action=true WHERE id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static getAllById({ process_work_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM process_material WHERE process_work_id = $1`,
        [process_work_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = ProcessMaterialTable
