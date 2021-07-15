const pool = require("../databasePool")
var format = require("pg-format")

class MssqlTable {
  //admin
  static insert({ dataCopy }) {
    // console.log("[DATA]", dataCopy);
    let dataValue = []
    dataCopy.forEach((item) => {
      let innerData = []
      innerData.push(item.userid)
      innerData.push(item.checktime)
      innerData.push(item.name)
      dataValue.push(innerData)
    })
    return new Promise((resolve, reject) => {
      // resolve({ message: "success" });
      pool.query(
        format("INSERT INTO mssql_table(userid, checktime, name) VALUES %L", dataValue),
        [],
        (error, response) => {
          if (error) {
            return reject(error)
          }
          resolve({ message: "success" })
        }
      )
    })
  }
  static delete() {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM mssql_table`, [], (error, response) => {
        if (error) return reject(error)
        resolve({ message: "success" })
      })
    })
  }
}

module.exports = MssqlTable
