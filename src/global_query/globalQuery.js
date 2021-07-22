const pool = require("../databasePool")

class GlobalQuery {

    static checkExist({ id, table_name }) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT id FROM ${table_name} WHERE id = $1`, [id], (error, result) => {
                if (error) return reject(error)

                resolve(result.rows);
            })
        })
    }

}

module.exports = GlobalQuery