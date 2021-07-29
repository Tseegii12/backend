const pool = require("../databasePool")

class UsersTable {
  //admin
  static getUsers() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT users.id, users.user_name, users.name, users.type_id, users.project_id, user_type.name AS user_type_name FROM users INNER JOIN user_type ON users.type_id = user_type.id`,
        [],
        (error, response) => {
          if (error) {
            return reject(error)
          }
          resolve(response.rows)
        }
      )
    })
  }

  //mobile
  static getManagers() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT*FROM users WHERE type_id=3`, [], (error, response) => {
        if (error) {
          return reject(error)
        }
        resolve(response.rows)
      })
    })
  }
  static getUsersForPicker() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT users.id, users.name, users.type_id, user_type.name AS user_type_name FROM users INNER JOIN user_type ON users.type_id = user_type.id WHERE users.type_id = 3 OR users.type_id = 6 OR users.type_id = 9`,
        [],
        (error, response) => {
          if (error) {
            return reject(error)
          }
          resolve(response.rows)
        }
      )
    })
  }

  static getUserByRole(roleTitle) {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT users.id, users.name FROM users INNER JOIN user_type ON users.type_id = user_type.id WHERE user_type.title = $1`, [roleTitle], (error, result) => {
        if (error) return reject(error);

        resolve(result.rows)
      })
    })
  }
}

module.exports = UsersTable
