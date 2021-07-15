const pool = require("../databasePool")

class WorkAttendanceTable {
  static insert({ user_id, date, salary }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO work_attendance(user_id, date, salary) VALUES($1, $2, $3)`,
        [user_id, date, salary],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static getWorkersByPj({ project_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select work_attendance.*, table1.name, table1.type_name, project.name as pj_name from work_attendance
        inner join (
          select users.*, user_type.name as type_name from users 
          inner join user_type on users.type_id = user_type.id
        ) as table1 on work_attendance.user_id = table1.id
        inner join project on work_attendance.project_id = project.id
        where work_attendance.project_id = $1`,
        [project_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = WorkAttendanceTable
