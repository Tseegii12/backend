const pool = require("../databasePool")

class customerTable {
  static storeUser({ user_name, passwordHash, name, type_id, project_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO users(user_name, password, name, type_id, project_id)
        VALUES($1, $2, $3, $4, $5) RETURNING user_name, password`,
        [user_name, passwordHash, name, type_id, project_id],
        (error, response) => {
          if (error) return reject(error)

          resolve({ users: response.rows[0] })
        }
      )
    })
  }
  static getUserById(id) {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM users WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)

        resolve({ users: response.rows[0] })
      })
    })
  }

  static getUserByName({ user_name }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT users.id, users.name, users.password, users.user_name, users.type_id, json_agg(json_build_object('id', user_type.id, 'title', user_type.title)) as role FROM users INNER join user_type on users.type_id = user_type.id where lower(users.user_name) = lower($1) group by users.id`,
        [user_name],
        (error, response) => {
          if (error) return reject(error)

          resolve({ users: response.rows[0] })
        }
      )
    })
  }

  static update({ user_name, name, type_id, project_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE users SET user_name=$1, name=$2, type_id=$3, project_id=$4 WHERE id = $5`,
        [user_name, name, type_id, project_id, id],
        (error, response) => {
          if (error) return reject(error)

          resolve({ message: "success" })
        }
      )
    })
  }
  static updatePass({ user_name, name, passwordHash, type_id, project_id, id }) {
    return new Promise((resolve, reject) => {
      console.log("?", passwordHash)
      pool.query(
        `UPDATE users SET user_name=$1, name=$2, type_id=$3, project_id=$4, password=$6 WHERE id = $5`,
        [user_name, name, type_id, project_id, id, passwordHash],
        (error, response) => {
          if (error) return reject(error)

          resolve({ message: "success" })
        }
      )
    })
  }
  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM users WHERE id = $1`, [id], (error, response) => {
        if (error) return reject(error)

        resolve({ message: "success" })
      })
    })
  }
}

module.exports = customerTable
