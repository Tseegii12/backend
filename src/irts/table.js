const pool = require("../databasePool")
var format = require("pg-format")

class IrtsTable {
  //admin
  static insert({ worker_id, tsalin, tuluv_id, data }) {
    // console.log("1", data);
    let dataValue = []
    data.forEach((item) => {
      let innerData = []
      innerData.push(item.id)
      // innerData.push(`current_date`);
      innerData.push(item.udur_tsalin)
      innerData.push(item.current_tuluv_id)
      innerData.push(item.huruu_hee)
      dataValue.push(innerData)
    })
    // console.log("2", dataValue);
    return new Promise((resolve, reject) => {
      // resolve({ message: "test" });
      pool.query(
        // `INSERT INTO irts(worker_id, tsalin, tuluv_id) VALUES($1,$2,$3)`,
        format(
          "INSERT INTO irts(worker_id, tsalin, tuluv_id, huruu_hee) VALUES %L",
          dataValue
        ),
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

  static deleteIrtsTotal() {
    return new Promise((resolve, reject) => {
      pool.query(`DELETE FROM irts_total`, [], (error, response) => {
        if (error) {
          return reject(error)
        }
        resolve({ message: "success" })
      })
    })
  }

  static updateIrts() {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE irts SET in_time = mssql_table.checktime, out_time = mssql_table.checktime FROM mssql_table
      WHERE irts.huruu_hee = mssql_table.name AND irts.date = mssql_table.checktime::date;`,
        [],
        (error, response) => {
          if (error) {
            return reject(error)
          }
          resolve({ message: "irts updated" })
        }
      )
    })
  }

  static insertIrtsTotal({
    manager_id,
    manager_name,
    pj_name,
    irsen,
    uvchtei,
    tasalsan,
    chuluutei,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO irts_total(manager_id,manager_name,pj_name,irsen,uvchtei,tasalsan,chuluutei) VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [manager_id, manager_name, pj_name, irsen, uvchtei, tasalsan, chuluutei],
        (error, response) => {
          if (error) {
            return reject(error)
          }
          resolve({ message: "success" })
        }
      )
    })
  }

  static getIrtsTotal() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM irts_total`, [], (error, response) => {
        if (error) {
          return reject(error)
        }
        resolve(response.rows)
      })
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
        workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN 
                  (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                  INNER JOIN 
                    (SELECT users.*, project.name as pj_name FROM users
                     INNER JOIN project ON users.project_id = project.id) as userA
                     ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
        ORDER BY ovog, ner, date desc`,
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

  static getAllDistinct() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT DISTINCT ON (workers.manager_id) workers.manager_id, workers.manager_name, workers.pj_name FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN 
               (
                 SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                   INNER JOIN 
                            (
                    SELECT users.*, project.name AS pj_name FROM users
                               INNER JOIN project ON users.project_id = project.id
                  ) AS userA ON worker.manager_id = userA.id
             ) AS workers ON irts.worker_id = workers.id`,
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

  static getAllCount() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT count(*) FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN 
                  (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                  INNER JOIN 
                    (SELECT users.*, project.name as pj_name FROM users
                     INNER JOIN project ON users.project_id = project.id) as userA
                     ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id`,
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

  static getSpecial() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT table1.*, table2.count, table2.tuluv_ner FROM 
        (
          SELECT DISTINCT ON (workers.manager_id) workers.manager_id, workers.manager_name, workers.pj_name FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN 
            (
               SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
               INNER JOIN 
                   (
                      SELECT users.*, project.name AS pj_name FROM users
                      INNER JOIN project ON users.project_id = project.id
                   ) AS userA ON worker.manager_id = userA.id
            ) AS workers ON irts.worker_id = workers.id
        ) AS table1
      INNER JOIN    
         (
          SELECT COUNT(irts.tuluv_id), irts_tuluv.name AS tuluv_ner, workers.manager_id FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN 
             (
                 SELECT worker.*, userA.name AS manager_name, userA.project_id, userA.pj_name FROM worker
                 INNER JOIN 
                  (
                      SELECT users.*, project.name AS pj_name FROM users
                      INNER JOIN project ON users.project_id = project.id
                  ) AS userA ON worker.manager_id = userA.id
             ) AS workers ON irts.worker_id = workers.id
          GROUP BY tuluv_ner, workers.manager_id
         ) AS table2 ON table1.manager_id = table2.manager_id
      ORDER BY manager_name, manager_id`,
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

  static getAllCountDistinct(manager_id) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN 
               (
                 SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                   INNER JOIN 
                            (
                    SELECT users.*, project.name AS pj_name FROM users
                               INNER JOIN project ON users.project_id = project.id
                  ) AS userA ON worker.manager_id = userA.id
             ) AS workers ON irts.worker_id = workers.id
        WHERE manager_id = $1
        GROUP BY tuluv_ner ORDER BY tuluv_ner`,
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

  static getAllCountDistinctDate(manager_id) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner, irts.date FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                       SELECT users.*, project.name AS pj_name FROM users
                       INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
        ) AS workers ON irts.worker_id = workers.id
        WHERE manager_id = $1 GROUP BY tuluv_ner, irts.date ORDER BY tuluv_ner, irts.date DESC`,
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

  static getAllCount123() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN 
                  (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                  INNER JOIN 
                    (SELECT users.*, project.name as pj_name FROM users
                     INNER JOIN project ON users.project_id = project.id) as userA
                     ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
        GROUP BY tuluv_ner`,
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

  static getBySearch({ dateStart, dateFinish, pj_id, manager_id }) {
    console.log(dateStart, dateFinish, pj_id, manager_id)
    if (pj_id !== null && manager_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("tusluur haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
            workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
              (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
              INNER JOIN 
                (SELECT users.*, project.name as pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id) as userA
                 ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
              project_id = $1`,
            [pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("tusluur haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
            workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
              (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
              INNER JOIN 
                (SELECT users.*, project.name as pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id) as userA
                 ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
            (date BETWEEN $1 AND $2) AND 
            (project_id = $3)`,
            [dateStart, dateFinish, pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id !== null && pj_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("managereer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
            workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
              (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
              INNER JOIN 
                (SELECT users.*, project.name as pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id) as userA
                 ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
              manager_id = $1
            ORDER BY ovog, ner, date desc`,
            [manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("managereer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
            workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
              (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
              INNER JOIN 
                (SELECT users.*, project.name as pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id) as userA
                 ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
              (date BETWEEN $1 AND $2) AND
              (manager_id = $3)
            ORDER BY ovog, ner, date desc`,
            [dateStart, dateFinish, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id !== null) {
      if (dateStart === null && dateFinish === null) {
        console.log("bugdengeer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
            workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
              (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
              INNER JOIN 
                (SELECT users.*, project.name as pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id) as userA
                 ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE
              (project_id = $1) AND
              (manager_id = $2)
            ORDER BY ovog, ner, date desc`,
            [pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("bugdengeer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
            workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
              (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
              INNER JOIN 
                (SELECT users.*, project.name as pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id) as userA
                 ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
              (date BETWEEN $1 AND $2) AND 
              (project_id = $3) AND
              (manager_id = $4)
            ORDER BY ovog, ner, date desc`,
            [dateStart, dateFinish, pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id === null) {
      console.log("A")
      if (dateStart && dateFinish !== null) {
        console.log("objectgui haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT irts.*, workers.ovog, workers.ner, workers.utas_dugaar, workers.alban_tushaal, workers.huruu_hee,
            workers.manager_name, workers.manager_id, workers.project_id, workers.pj_name, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
              (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
              INNER JOIN 
                (SELECT users.*, project.name as pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id) as userA
                 ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE date BETWEEN $1 AND $2
            ORDER BY ovog, ner, date desc`,
            [dateStart, dateFinish],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    }
  }

  static getBySearchTuluv({ dateStart, dateFinish, pj_id, manager_id }) {
    if (pj_id !== null && manager_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("tusluur haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT DISTINCT ON (irts.tuluv_id) irts.tuluv_id, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE project_id = $1`,
            [pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("tusluur haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT DISTINCT ON (irts.tuluv_id) irts.tuluv_id, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (project_id = $3)`,
            [dateStart, dateFinish, pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id !== null && pj_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("managereer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT DISTINCT ON (irts.tuluv_id) irts.tuluv_id, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE  
                      manager_id = $1`,
            [manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("managereer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT DISTINCT ON (irts.tuluv_id) irts.tuluv_id, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (manager_id = $3)`,
            [dateStart, dateFinish, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id !== null) {
      if (dateStart === null && dateFinish === null) {
        console.log("bugdengeer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT DISTINCT ON (irts.tuluv_id) irts.tuluv_id, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (project_id = $1) AND
                      (manager_id = $2)`,
            [pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("bugdengeer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT DISTINCT ON (irts.tuluv_id) irts.tuluv_id, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (project_id = $3) AND
                      (manager_id = $4)`,
            [dateStart, dateFinish, pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id === null) {
      if (dateStart && dateFinish !== null) {
        console.log("objectgui haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT DISTINCT ON (irts.tuluv_id) irts.tuluv_id, irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE date BETWEEN $1 AND $2`,
            [dateStart, dateFinish],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    }
  }

  static getBySearchCount({ dateStart, dateFinish, pj_id, manager_id }) {
    if (pj_id !== null && manager_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("tusluur haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE project_id = $1
            GROUP BY tuluv_ner`,
            [pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("tusluur haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (project_id = $3)
            GROUP BY tuluv_ner`,
            [dateStart, dateFinish, pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id !== null && pj_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("managereer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE manager_id = $1
            GROUP BY tuluv_ner`,
            [manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("managereer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (manager_id = $3)
            GROUP BY tuluv_ner`,
            [dateStart, dateFinish, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id !== null) {
      if (dateStart === null && dateFinish === null) {
        console.log("bugdengeer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (project_id = $1) AND
                      (manager_id = $2)
            GROUP BY tuluv_ner`,
            [pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("bugdengeer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (project_id = $3) AND
                      (manager_id = $4)
            GROUP BY tuluv_ner`,
            [dateStart, dateFinish, pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id === null) {
      if (dateStart && dateFinish !== null) {
        console.log("objectgui haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(irts.tuluv_id), irts_tuluv.name AS tuluv_ner FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE date BETWEEN $1 AND $2
            GROUP BY tuluv_ner`,
            [dateStart, dateFinish],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    }
  }

  static getBySearchCountAll({ dateStart, dateFinish, pj_id, manager_id }) {
    if (pj_id !== null && manager_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("tusluur haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE project_id = $1`,
            [pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("tusluur haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (project_id = $3)`,
            [dateStart, dateFinish, pj_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id !== null && pj_id === null) {
      if (dateStart === null && dateFinish === null) {
        console.log("managereer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE manager_id = $1`,
            [manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("managereer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (manager_id = $3)`,
            [dateStart, dateFinish, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id !== null) {
      if (dateStart === null && dateFinish === null) {
        console.log("bugdengeer haih udurgui")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE
                      (project_id = $1) AND
                      (manager_id = $2)`,
            [pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      } else {
        console.log("bugdengeer haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE 
                      (date BETWEEN $1 AND $2) AND 
                      (project_id = $3) AND
                      (manager_id = $4)`,
            [dateStart, dateFinish, pj_id, manager_id],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    } else if (manager_id && pj_id === null) {
      if (dateStart && dateFinish !== null) {
        console.log("objectgui haih udurtei")
        return new Promise((resolve, reject) => {
          pool.query(
            `SELECT count(*) FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN 
                      (SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN 
                        (SELECT users.*, project.name as pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id) as userA
                         ON worker.manager_id = userA.id) AS workers  ON irts.worker_id = workers.id
            WHERE date BETWEEN $1 AND $2`,
            [dateStart, dateFinish],
            (error, response) => {
              if (error) {
                return reject(error)
              }
              resolve(response.rows)
            }
          )
        })
      }
    }
  }

  static getAllByManager({ manager_id, dateStart, dateFinish }) {
    if (dateStart === null && dateFinish === null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT irts.*, worker.ovog, worker.ner, worker.utas_dugaar, worker.alban_tushaal,
        worker.manager_id, irts_tuluv.name AS tuluv_ner FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN worker ON irts.worker_id = worker.id
        WHERE worker.manager_id = $1
        ORDER BY ovog, ner, date desc`,
          [manager_id],
          (error, response) => {
            if (error) {
              return reject(error)
            }
            resolve(response.rows)
          }
        )
      })
    } else {
      console.log("?", dateFinish, dateStart)
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT irts.*, worker.ovog, worker.ner, worker.utas_dugaar, worker.alban_tushaal,
        worker.manager_id, irts_tuluv.name AS tuluv_ner FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN worker ON irts.worker_id = worker.id
        WHERE worker.manager_id = $1 AND date BETWEEN $2 AND $3
        ORDER BY ovog, ner, date desc`,
          [manager_id, dateStart, dateFinish],
          (error, response) => {
            if (error) {
              return reject(error)
            }
            resolve(response.rows)
          }
        )
      })
    }
  }

  static getAllByManagerNow({ manager_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT irts.*, worker.ovog, worker.ner, worker.utas_dugaar, worker.alban_tushaal,
        worker.manager_id, irts_tuluv.name AS tuluv_ner FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN worker ON irts.worker_id = worker.id
        WHERE worker.manager_id = $1 AND date = current_date
        ORDER BY ovog, ner asc`,
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

  static update({ tuluv_id, id, data }) {
    return new Promise((resolve, reject) => {
      // console.log(data);
      // resolve({ message: "success" });
      let dataValue = []
      data.forEach((item) => {
        let innerData = []
        innerData.push(item.id)
        innerData.push(item.tuluv_id)
        dataValue.push(innerData)
      })
      // console.log(dataValue);
      // data.forEach((item) => {
      //   let tuluv_id = item.tuluv_id;
      //   let id = item.id;
      //   pool.query(
      //     `UPDATE irts SET tuluv_id = $1 WHERE id = $2`,
      //     [tuluv_id, id],
      //     (error, response) => {
      //       if (error) {
      //         return reject(error);
      //       }
      //       resolve({ message: "success" });
      //     }
      //   );
      // });
      pool.query(
        format(
          "UPDATE irts AS t SET tuluv_id = c.column_a::integer FROM (VALUES %L) AS c(column_b, column_a) WHERE c.column_b::integer = t.id",
          dataValue
        ),
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
}

module.exports = IrtsTable
