const pool = require("../../databasePool");

class QueryIrtsTable {
  // 1
  static get1({ date1, date2 }) {
    if (date1 === null && date2 === null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) AS niit_tsalin, COUNT(irts.worker_id) AS niit_ajilchin, workers.project_id, workers.pj_name FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
               SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
               INNER JOIN (
                      SELECT users.*, project.name AS pj_name FROM users
                      INNER JOIN project ON users.project_id = project.id
               ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6
          GROUP BY workers.project_id, workers.pj_name`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) AS niit_tsalin, COUNT(irts.worker_id) AS niit_ajilchin, workers.project_id, workers.pj_name FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
               SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
               INNER JOIN (
                      SELECT users.*, project.name AS pj_name FROM users
                      INNER JOIN project ON users.project_id = project.id
               ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6 AND irts.date BETWEEN $1 AND $2
          GROUP BY workers.project_id, workers.pj_name`,
          [date1, date2],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows);
          }
        );
      });
    }
  }
  static get1CountTsalin({ date1, date2 }) {
    if (date1 === null && date2 === null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) AS niit_tsalin FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                         SELECT users.*, project.name AS pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) AS niit_tsalin FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                         SELECT users.*, project.name AS pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6 AND irts.date BETWEEN $1 AND $2`,
          [date1, date2],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    }
  }
  static get1CountAjilchin({ date1, date2 }) {
    if (date1 === null && date2 === null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT COUNT(irts.worker_id) AS niit_ajilchin FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                         SELECT users.*, project.name AS pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT COUNT(irts.worker_id) AS niit_ajilchin FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                         SELECT users.*, project.name AS pj_name FROM users
                         INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6 AND irts.date BETWEEN $1 AND $2`,
          [date1, date2],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    }
  }
  //   2
  static get2({ date1, date2, pj_id }) {
    if (date1 !== null && date2 !== null && pj_id !== null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT table1.manager_name, table2.count AS ajillaj_bga, table2.sum AS tsalin_zardal, table3.count AS niit_ajiltan FROM (
            SELECT DISTINCT ON (workers.manager_id) workers.manager_id, workers.manager_name,
            workers.pj_name, workers.project_id FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                    SELECT users.*, project.name AS pj_name FROM users
                    INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
            ) AS workers ON irts.worker_id = workers.id ) AS table1 
          INNER JOIN (
            SELECT COUNT(irts.worker_id), SUM(irts.tsalin), workers.manager_id FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN (
                 SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                 INNER JOIN (
                    SELECT users.*, project.name AS pj_name FROM users
                    INNER JOIN project ON users.project_id = project.id
                 ) AS userA ON worker.manager_id = userA.id
            ) AS workers ON irts.worker_id = workers.id
            WHERE irts.date BETWEEN $1 AND $2 AND workers.project_id = $3 AND irts.tuluv_id = 6 GROUP BY workers.manager_id ) AS table2 ON table1.manager_id = table2.manager_id
          INNER JOIN (
            SELECT COUNT(irts.worker_id), workers.manager_id FROM irts
              INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
              INNER JOIN (
                      SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN (
                               SELECT users.*, project.name AS pj_name FROM users
                               INNER JOIN project ON users.project_id = project.id
                      ) AS userA ON worker.manager_id = userA.id
              ) AS workers ON irts.worker_id = workers.id 
              WHERE irts.date BETWEEN $1 AND $2 AND workers.project_id = $3 GROUP BY workers.manager_id
          ) AS table3 ON table1.manager_id = table3.manager_id`,
          [date1, date2, pj_id],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT table1.manager_name, table2.count AS ajillaj_bga, table2.sum AS tsalin_zardal, table3.count AS niit_ajiltan FROM (
            SELECT DISTINCT ON (workers.manager_id) workers.manager_id, workers.manager_name,
            workers.pj_name, workers.project_id FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                    SELECT users.*, project.name AS pj_name FROM users
                    INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
            ) AS workers ON irts.worker_id = workers.id ) AS table1 
          INNER JOIN (
            SELECT COUNT(irts.worker_id), SUM(irts.tsalin), workers.manager_id FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN (
                 SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                 INNER JOIN (
                    SELECT users.*, project.name AS pj_name FROM users
                    INNER JOIN project ON users.project_id = project.id
                 ) AS userA ON worker.manager_id = userA.id
            ) AS workers ON irts.worker_id = workers.id
            WHERE irts.tuluv_id = 6 GROUP BY workers.manager_id ) AS table2 ON table1.manager_id = table2.manager_id
          INNER JOIN (
            SELECT COUNT(irts.worker_id), workers.manager_id FROM irts
              INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
              INNER JOIN (
                      SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                      INNER JOIN (
                               SELECT users.*, project.name AS pj_name FROM users
                               INNER JOIN project ON users.project_id = project.id
                      ) AS userA ON worker.manager_id = userA.id
              ) AS workers ON irts.worker_id = workers.id GROUP BY workers.manager_id
          ) AS table3 ON table1.manager_id = table3.manager_id`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows);
          }
        );
      });
    }
  }
  static get2TotalAjilchin({ date1, date2, pj_id }) {
    if (date1 !== null && date2 !== null && pj_id !== null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT COUNT(irts.worker_id) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                  SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                  INNER JOIN (
                           SELECT users.*, project.name AS pj_name FROM users
                           INNER JOIN project ON users.project_id = project.id
                  ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id 
          WHERE irts.date BETWEEN $1 AND $2 AND workers.project_id = $3`,
          [date1, date2, pj_id],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT COUNT(irts.worker_id) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                  SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                  INNER JOIN (
                           SELECT users.*, project.name AS pj_name FROM users
                           INNER JOIN project ON users.project_id = project.id
                  ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    }
  }
  static get2TotalAjilajBga({ date1, date2, pj_id }) {
    if (date1 !== null && date2 !== null && pj_id !== null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT COUNT(irts.worker_id) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                  SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                  INNER JOIN (
                           SELECT users.*, project.name AS pj_name FROM users
                           INNER JOIN project ON users.project_id = project.id
                  ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id 
          WHERE irts.date BETWEEN $1 AND $2 AND workers.project_id = $3 AND irts.tuluv_id = 6`,
          [date1, date2, pj_id],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT COUNT(irts.worker_id) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
                  SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                  INNER JOIN (
                           SELECT users.*, project.name AS pj_name FROM users
                           INNER JOIN project ON users.project_id = project.id
                  ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id WHERE irts.tuluv_id = 6`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    }
  }
  static get2TotalTsalin({ date1, date2, pj_id }) {
    if (date1 !== null && date2 !== null && pj_id !== null) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
               SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
               INNER JOIN (
                  SELECT users.*, project.name AS pj_name FROM users
                  INNER JOIN project ON users.project_id = project.id
               ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.date BETWEEN $1 AND $2 AND workers.project_id = $3 AND irts.tuluv_id = 6`,
          [date1, date2, pj_id],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
               SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
               INNER JOIN (
                  SELECT users.*, project.name AS pj_name FROM users
                  INNER JOIN project ON users.project_id = project.id
               ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    }
  }
  // 3
  static get3({ date1, date2, pj_id, manager_id }) {
    if (
      date1 !== null &&
      date2 !== null &&
      pj_id !== null &&
      manager_id !== null
    ) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT table1.huruu_hee, table1.ner, table1.alban_tushaal, table2.count AS ajillasan_udur, table2.sum AS tsalin_zardal FROM (
            SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
            INNER JOIN (
                 SELECT users.*, project.name AS pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id
            ) AS userA ON worker.manager_id = userA.id
            WHERE project_id = $3 AND manager_id = $4 
          ) AS table1
          INNER JOIN (
            SELECT COUNT(*), SUM(irts.tsalin), irts.worker_id FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN (
               SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
               INNER JOIN (
                  SELECT users.*, project.name AS pj_name FROM users
                  INNER JOIN project ON users.project_id = project.id
               ) AS userA ON worker.manager_id = userA.id
            ) AS workers ON irts.worker_id = workers.id
            WHERE irts.tuluv_id = 6 AND irts.date BETWEEN $1 AND $2 GROUP BY irts.worker_id
          ) AS table2 ON table1.id = table2.worker_id`,
          [date1, date2, pj_id, manager_id],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT table1.huruu_hee, table1.ner, table1.alban_tushaal, table2.count AS ajillasan_udur, table2.sum AS tsalin_zardal FROM (
            SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
            INNER JOIN (
                 SELECT users.*, project.name AS pj_name FROM users
                 INNER JOIN project ON users.project_id = project.id
            ) AS userA ON worker.manager_id = userA.id
          ) AS table1
          INNER JOIN (
            SELECT COUNT(*), SUM(irts.tsalin), irts.worker_id FROM irts
            INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
            INNER JOIN (
               SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
               INNER JOIN (
                  SELECT users.*, project.name AS pj_name FROM users
                  INNER JOIN project ON users.project_id = project.id
               ) AS userA ON worker.manager_id = userA.id
            ) AS workers ON irts.worker_id = workers.id
            WHERE irts.tuluv_id = 6 GROUP BY irts.worker_id
          ) AS table2 ON table1.id = table2.worker_id`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows);
          }
        );
      });
    }
  }
  static get3TotalTsalin({ date1, date2, pj_id, manager_id }) {
    if (
      date1 !== null &&
      date2 !== null &&
      pj_id !== null &&
      manager_id !== null
    ) {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
             SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
             INNER JOIN (
                SELECT users.*, project.name AS pj_name FROM users
                INNER JOIN project ON users.project_id = project.id
             ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6 AND irts.date BETWEEN $1 AND $2 AND workers.project_id = $3
          AND workers.manager_id = $4`,
          [date1, date2, pj_id, manager_id],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    } else {
      return new Promise((resolve, reject) => {
        pool.query(
          `SELECT SUM(irts.tsalin) FROM irts
          INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
          INNER JOIN (
             SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
             INNER JOIN (
                SELECT users.*, project.name AS pj_name FROM users
                INNER JOIN project ON users.project_id = project.id
             ) AS userA ON worker.manager_id = userA.id
          ) AS workers ON irts.worker_id = workers.id
          WHERE irts.tuluv_id = 6`,
          [],
          (error, response) => {
            if (error) {
              return reject(error);
            }
            resolve(response.rows[0]);
          }
        );
      });
    }
  }
  // 4
  static get4({ in_time, pj_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT irts.*, irts_tuluv.name as tuluv_name, workers.project_id, workers.manager_name, workers.ner, workers.huruu_hee, workers.alban_tushaal FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                        SELECT users.*, project.name AS pj_name FROM users
                        INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
        ) AS workers ON irts.worker_id = workers.id
        WHERE project_id = $2 AND in_time >= $1 ORDER BY in_time DESC`,
        [in_time, pj_id],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          resolve(response.rows);
        }
      );
    });
  }
  static get4Total({ in_time, pj_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT COUNT(*) FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                        SELECT users.*, project.name AS pj_name FROM users
                        INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
        ) AS workers ON irts.worker_id = workers.id
        WHERE project_id = $2 AND in_time >= $1`,
        [in_time, pj_id],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          resolve(response.rows);
        }
      );
    });
  }
  // 5
  static get5Honoson({ date, pj_id }) {
    let dateSampleStart = date + " 11:00 PM";
    let dateSampleFinish = date + " 11:59 PM";
    console.log(dateSampleStart, dateSampleFinish, pj_id);
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT irts.*, irts_tuluv.name as tuluv_name, workers.project_id, workers.manager_name, workers.ner,
        workers.huruu_hee, workers.alban_tushaal FROM irts
        INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
        INNER JOIN (
                SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
                INNER JOIN (
                        SELECT users.*, project.name AS pj_name FROM users
                        INNER JOIN project ON users.project_id = project.id
                ) AS userA ON worker.manager_id = userA.id
        ) AS workers ON irts.worker_id = workers.id
        WHERE project_id = $4 AND date=$1 
        AND in_time >= $2 AND out_time <= $3 ORDER BY out_time DESC`,
        [date, dateSampleStart, dateSampleFinish, pj_id],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          resolve(response.rows);
        }
      );
    });
  }
  static get5Iluu({ date, dateStart, pj_id }) {
    let dateSampleFinish = date + " 10:59 PM";
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT irts.*, irts_tuluv.name as tuluv_name, workers.project_id, workers.manager_name, workers.ner,
workers.huruu_hee, workers.alban_tushaal FROM irts
INNER JOIN irts_tuluv ON irts.tuluv_id = irts_tuluv.id
INNER JOIN (
        SELECT worker.*, userA.name as manager_name, userA.project_id, userA.pj_name FROM worker
        INNER JOIN (
                SELECT users.*, project.name AS pj_name FROM users
                INNER JOIN project ON users.project_id = project.id
        ) AS userA ON worker.manager_id = userA.id
) AS workers ON irts.worker_id = workers.id
WHERE project_id = $4 AND date=$1 AND out_time BETWEEN $2 AND $3
ORDER BY out_time DESC`,
        [date, dateStart, dateSampleFinish, pj_id],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          resolve(response.rows);
        }
      );
    });
  }
}

module.exports = QueryIrtsTable;
