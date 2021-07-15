const pool = require("../../databasePool")

class TailanTable {
  static getRoomWorks({ field_room_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select field_work.*, field_room_plus.name as room_name, field_room_plus.field_name, field_room_plus.block_name,
        field_room_plus.pj_name, users.name as user_name, work.name as work_name from field_work 
        inner join (
            select field_room.*, field.name as field_name, block.name as block_name,
            project.name as pj_name from field_room 
            inner join field on field_room.field_id = field.id
            inner join block on field.block_id = block.id
            inner join project on block.project_id = project.id
            where field_room.id = $1
        ) as field_room_plus on field_work.field_room_id = field_room_plus.id
        inner join users on field_work.user_id = users.id
        inner join work on field_work.work_id = work.id`,
        [field_room_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getFieldWorks({ field_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select field_work.*, pj_block_field.name as field_name, pj_block_field.block_name, pj_block_field.pj_name,
        users.name as user_name, work.name as work_name from field_work
        inner join ( 
          select field.*, block.name as block_name, project.name as pj_name from field
          inner join block on field.block_id = block.id
          inner join project on block.project_id = project.id) as pj_block_field
        on field_work.field_id = pj_block_field.id
        inner join users on field_work.user_id = users.id
        inner join work on field_work.work_id = work.id where field_work.field_id = $1`,
        [field_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getFieldWorksByProcess({ floor_number, block_id, process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select field_work.*, pj_block_field.name as field_name, pj_block_field.block_name, pj_block_field.pj_name,
        users.name as user_name, work.name as work_name from field_work
        inner join ( 
          select field.*, block.name as block_name, project.name as pj_name from field
          inner join block on field.block_id = block.id
          inner join project on block.project_id = project.id where field.block_id = $2 and field.process_id = $3  and field.floor_number = $1) as pj_block_field
        on field_work.field_id = pj_block_field.id
        inner join users on field_work.user_id = users.id
        inner join work on field_work.work_id = work.id`,
        [floor_number, block_id, process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getFieldWorksByProcessSub({ block_id, process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select field_work.*, pj_block_field.name as field_name, pj_block_field.block_name, pj_block_field.pj_name,
        users.name as user_name, work.name as work_name from field_work
        inner join ( 
          select field.*, block.name as block_name, project.name as pj_name from field
          inner join block on field.block_id = block.id
          inner join project on block.project_id = project.id where field.block_id = $1 and field.process_id = $2) as pj_block_field
        on field_work.field_id = pj_block_field.id
        inner join users on field_work.user_id = users.id
        inner join work on field_work.work_id = work.id`,
        [block_id, process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getBaraaUldegdel({ project_id, material_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT getbaraauldegdel($1, $2)`,
        [project_id, material_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = TailanTable
