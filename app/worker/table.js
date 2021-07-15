const pool = require("../../databasePool")

class WorkerTable {
  //admin
  static insert({
    ovog,
    ner,
    register,
    utas_dugaar,
    alban_tushaal,
    manager_id,
    udur_tsalin,
    niigmiin_daatgal,
    eruul_mend_daatgal,
    ajild_orson_ognoo,
    comment,
    tuluv_id,
    huruu_code,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO worker(ovog, ner, register, utas_dugaar, alban_tushaal, manager_id, udur_tsalin, niigmiin_daatgal, eruul_mend_daatgal, ajild_orson_ognoo, comment, tuluv_id, huruu_hee) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          ovog,
          ner,
          register,
          utas_dugaar,
          alban_tushaal,
          manager_id,
          udur_tsalin,
          niigmiin_daatgal,
          eruul_mend_daatgal,
          ajild_orson_ognoo,
          comment,
          tuluv_id,
          huruu_code,
        ],
        (error, response) => {
          if (error) {
            return reject(error)
          }
          resolve({ message: "success" })
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT worker.*, userss.name AS manager_name, userss.pj_name, irts_tuluv.name AS tuluv_name FROM worker
        LEFT JOIN (
          SELECT users.*, project.name AS pj_name FROM users 
          LEFT JOIN project ON users.project_id = project.id
        ) AS userss ON worker.manager_id = userss.id
        LEFT JOIN irts_tuluv ON worker.tuluv_id = irts_tuluv.id
        ORDER BY userss.pj_name, userss.name, worker.ovog, worker.ner`,
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
  static getAllByManager({ manager_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT worker.*, userss.name AS manager_name, userss.pj_name, irts_tuluv.name AS tuluv_name FROM worker
        LEFT JOIN (
          SELECT users.*, project.name AS pj_name FROM users 
          LEFT JOIN project ON users.project_id = project.id
        ) AS userss ON worker.manager_id = userss.id
        LEFT JOIN irts_tuluv ON worker.tuluv_id = irts_tuluv.id
        WHERE manager_id = $1 AND worker.is_active = true
        ORDER BY userss.pj_name, userss.name, worker.ovog, worker.ner`,
        [manager_id],
        (error, response) => {
          if (error) {
            return reject(error)
          }
          resolve(response.rows)
        }
      )
    })
  }
  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM worker WHERE id = $1`, [id], (error, response) => {
        if (error) {
          return reject(error)
        }
        resolve({ message: "success" })
      })
    })
  }
  static update({
    ovog,
    ner,
    register,
    utas_dugaar,
    alban_tushaal,
    manager_id,
    udur_tsalin,
    niigmiin_daatgal,
    eruul_mend_daatgal,
    ajild_orson_ognoo,
    comment,
    tuluv_id,
    id,
    huruu_code,
  }) {
    if (tuluv_id === 5) {
      console.log("InActive")
      return new Promise((resolve, reject) => {
        pool.query(
          `UPDATE worker SET ovog = $1,
          ner = $2,
          register = $3,
          utas_dugaar = $4,
          alban_tushaal = $5,
          manager_id = $6,
          udur_tsalin = $7,
          niigmiin_daatgal = $8,
          eruul_mend_daatgal = $9,
          ajild_orson_ognoo = $10,
          comment = $11,
          tuluv_id = $12,
          huruu_hee = $14,
          is_active = false
          WHERE id = $13`,
          [
            ovog,
            ner,
            register,
            utas_dugaar,
            alban_tushaal,
            manager_id,
            udur_tsalin,
            niigmiin_daatgal,
            eruul_mend_daatgal,
            ajild_orson_ognoo,
            comment,
            tuluv_id,
            id,
            huruu_code,
          ],
          (error, response) => {
            if (error) {
              return reject(error)
            }
            resolve({ message: "success" })
          }
        )
      })
    } else if (tuluv_id === 1) {
      return new Promise((resolve, reject) => {
        pool.query(
          `UPDATE worker SET ovog = $1,
          ner = $2,
          register = $3,
          utas_dugaar = $4,
          alban_tushaal = $5,
          manager_id = $6,
          udur_tsalin = $7,
          niigmiin_daatgal = $8,
          eruul_mend_daatgal = $9,
          ajild_orson_ognoo = $10,
          comment = $11,
          tuluv_id = $12,
          is_active = true,
          huruu_hee=$14 WHERE id = $13`,
          [
            ovog,
            ner,
            register,
            utas_dugaar,
            alban_tushaal,
            manager_id,
            udur_tsalin,
            niigmiin_daatgal,
            eruul_mend_daatgal,
            ajild_orson_ognoo,
            comment,
            tuluv_id,
            id,
            huruu_code,
          ],
          (error, response) => {
            if (error) {
              return reject(error)
            }
            resolve({ message: "success" })
          }
        )
      })
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `UPDATE worker SET ovog = $1,
          ner = $2,
          register = $3,
          utas_dugaar = $4,
          alban_tushaal = $5,
          manager_id = $6,
          udur_tsalin = $7,
          niigmiin_daatgal = $8,
          eruul_mend_daatgal = $9,
          ajild_orson_ognoo = $10,
          comment = $11,
          tuluv_id = $12, huruu_hee=$14 WHERE id = $13`,
          [
            ovog,
            ner,
            register,
            utas_dugaar,
            alban_tushaal,
            manager_id,
            udur_tsalin,
            niigmiin_daatgal,
            eruul_mend_daatgal,
            ajild_orson_ognoo,
            comment,
            tuluv_id,
            id,
            huruu_code,
          ],
          (error, response) => {
            if (error) {
              return reject(error)
            }
            resolve({ message: "success" })
          }
        )
      })
    }
  }
  static getRandomHee() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT random_huruu_hee();`, [], (error, response) => {
        if (error) {
          return reject(error)
        }
        resolve(response.rows)
      })
    })
  }
}

module.exports = WorkerTable
