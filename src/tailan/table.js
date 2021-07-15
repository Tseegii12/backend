const pool = require("../databasePool")

class TailanTable {
  static getAjilDelgerengui({ process_id, block_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT field_work.*, work_process.name AS work_name, work_process.process_name, work_process.process_id, block_field.field_name, block_field.block_name,
        users.name AS user_name, material.name AS material_name, field_work.material_too-field_work.material_used AS material_uldegdel FROM field_work
        INNER JOIN (SELECT work.*, process.name AS process_name FROM work INNER JOIN process ON work.process_id = process.id WHERE process.id = $1) AS work_process ON field_work.work_id = work_process.id
        INNER JOIN (SELECT field.name AS field_name, block.name AS block_name, field.id AS field_id, block.id AS block_id FROM field INNER JOIN block ON field.block_id = block.id WHERE block.id = $2) AS block_field
            ON field_work.field_id = block_field.field_id
        INNER JOIN users ON field_work.user_id = users.id
        INNER JOIN material ON field_work.material_id = material.id`,
        [process_id, block_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getAjilDelgerenguiByAil({ process_id, block_id, field_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT field_work.*, work_process.name AS work_name, work_process.process_name, work_process.process_id, block_field.field_name, block_field.block_name,
        users.name AS user_name, material.name AS material_name, field_work.material_too-field_work.material_used AS material_uldegdel FROM field_work
        INNER JOIN (SELECT work.*, process.name AS process_name FROM work INNER JOIN process ON work.process_id = process.id WHERE process.id = $1) AS work_process ON field_work.work_id = work_process.id
        INNER JOIN (SELECT field.name AS field_name, block.name AS block_name, field.id AS field_id, block.id AS block_id FROM field INNER JOIN block ON field.block_id = block.id WHERE block.id = $2 AND field.id = $3) AS block_field
            ON field_work.field_id = block_field.field_id
        INNER JOIN users ON field_work.user_id = users.id
        INNER JOIN material ON field_work.material_id = material.id`,
        [process_id, block_id, field_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getBaraaMaterial1({ process_id, block_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT work_material.*, material.name AS material_name,
        table1.block_name, table1.pj_name, table1.room_name, table1.field_name,
        table1.block_name1, table1.pj_name1, table1.field_name1,
        table1.user_name, table1.work_name, table1.block_id, table1.process_id,
        table1.block_id1, table1.process_id1
        FROM work_material
        INNER JOIN material ON work_material.material_id = material.id
        INNER JOIN (
          SELECT field_work.*, pj_block_field.name AS field_name, pj_block_field.block_name,
          pj_block_field.pj_name, room_plus.name AS room_name, pj_block_field.block_id, pj_block_field.process_id,
          room_plus.field_name as field_name1, room_plus.block_name as block_name1,
          room_plus.pj_name as pj_name1, room_plus.block_id as block_id1, room_plus.process_id as process_id1,
          users.name AS user_name, work.name AS work_name FROM field_work
          LEFT JOIN ( 
                SELECT field.*, block.name AS block_name, project.name AS pj_name FROM field
                INNER JOIN block ON field.block_id = block.id
                INNER JOIN project ON block.project_id = project.id)
                AS pj_block_field ON field_work.field_id = pj_block_field.id
          INNER JOIN users ON field_work.user_id = users.id
          LEFT JOIN (
                SELECT field_room.*, field.name AS field_name, block.name AS block_name, project.name AS pj_name, 
                field.block_id, field.process_id FROM field_room
                INNER JOIN field ON field_room.field_id = field.id
                INNER JOIN block ON field.block_id = block.id
                INNER JOIN project ON block.project_id = project.id) AS room_plus ON field_work.field_room_id = room_plus.id
          INNER JOIN work ON field_work.work_id = work.id
        ) AS table1 ON work_material.field_work_id = table1.id
        WHERE block_id1 = $2 AND process_id1 = $1`,
        [process_id, block_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getBaraaMaterial2({ process_id, block_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT work_material.*, material.name AS material_name,
        table1.block_name, table1.pj_name, table1.room_name, table1.field_name,
        table1.block_name1, table1.pj_name1, table1.field_name1,
        table1.user_name, table1.work_name, table1.block_id, table1.process_id,
        table1.block_id1, table1.process_id1
        FROM work_material
        INNER JOIN material ON work_material.material_id = material.id
        INNER JOIN (
          SELECT field_work.*, pj_block_field.name AS field_name, pj_block_field.block_name,
          pj_block_field.pj_name, room_plus.name AS room_name, pj_block_field.block_id, pj_block_field.process_id,
          room_plus.field_name as field_name1, room_plus.block_name as block_name1,
          room_plus.pj_name as pj_name1, room_plus.block_id as block_id1, room_plus.process_id as process_id1,
          users.name AS user_name, work.name AS work_name FROM field_work
          LEFT JOIN ( 
                SELECT field.*, block.name AS block_name, project.name AS pj_name FROM field
                INNER JOIN block ON field.block_id = block.id
                INNER JOIN project ON block.project_id = project.id)
                AS pj_block_field ON field_work.field_id = pj_block_field.id
          INNER JOIN users ON field_work.user_id = users.id
          LEFT JOIN (
                SELECT field_room.*, field.name AS field_name, block.name AS block_name, project.name AS pj_name, 
                field.block_id, field.process_id FROM field_room
                INNER JOIN field ON field_room.field_id = field.id
                INNER JOIN block ON field.block_id = block.id
                INNER JOIN project ON block.project_id = project.id) AS room_plus ON field_work.field_room_id = room_plus.id
          INNER JOIN work ON field_work.work_id = work.id
        ) AS table1 ON work_material.field_work_id = table1.id
        WHERE block_id = $2 AND process_id = $1`,
        [process_id, block_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getAjilchidByWork({ block_id, user_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT field_work.start_date, field_work.finish_date, field_work.is_done, work_process.name AS work_name, work_process.process_name, work_process.process_id, block_field.field_name, block_field.block_name,
        users.user_name AS user_name, users.user_type_name, material.name AS material_name, field_work.material_too-field_work.material_used AS material_uldegdel FROM field_work
        INNER JOIN (SELECT work.*, process.name AS process_name FROM work INNER JOIN process ON work.process_id = process.id) AS work_process ON field_work.work_id = work_process.id
        INNER JOIN (SELECT field.name AS field_name, block.name AS block_name, field.id AS field_id, block.id AS block_id FROM field INNER JOIN block ON field.block_id = block.id WHERE block.id = $1) AS block_field
            ON field_work.field_id = block_field.field_id
        INNER JOIN (select users.id, users.name as user_name, user_type.name as user_type_name from users inner join user_type on users.type_id = user_type.id WHERE users.id = $2) as users ON field_work.user_id = users.id
        INNER JOIN material ON field_work.material_id = material.id`,
        [block_id, user_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
  static getAjilchid({ block_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT user_block.*, users.name FROM user_block INNER JOIN users ON user_block.user_id = users.id WHERE user_block.block_id = $1`,
        [block_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = TailanTable
