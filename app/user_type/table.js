const pool = require("../../databasePool")

class UserTypeTable {
  //admin
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO user_type(name) VALUES($1)`, [name], (error, response) => {
        if (error) return reject(error)
        resolve(response)
      })
    })
  }

  static getType() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM user_type`, [], (error, response) => {
        if (error) return reject(error)
        resolve(response.rows)
      })
    })
  }

  //mobile
}

module.exports = UserTypeTable
