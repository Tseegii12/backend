const pool = require("../../databasePool")

class ProcessImgTable {
  static insert({ img_url, process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO process_img(img_url, process_id) VALUES($1, $2)`,
        [img_url, process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static getAllById({ process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT*FROM process_img WHERE process_id=$1`,
        [process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve(response.rows)
        }
      )
    })
  }
}

module.exports = ProcessImgTable
