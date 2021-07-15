const pool = require("../../databasePool")

class ProcessWorkTable {
  //mobile
  static insert({ field_work_id, unit_id, manager_id, admin_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO process_work(field_work_id, unit_id, manager_id, admin_id) VALUES($1, $2, $3, $4)`,
        [field_work_id, unit_id, manager_id, admin_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static update1Admin({ process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE process_work SET is_start_1_admin = true, start_date1_admin = NOW() WHERE id = $1`,
        [process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static update1Zahiral({ process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE process_work SET is_start_2_admin = true, start_date2_admin = NOW() WHERE id = $1`,
        [process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static update2Manager({
    start_date_manager,
    comment,
    finish_date_manager,
    process_id,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE process_work SET start_date_manager = $1, comment = $3, finish_date_manager = $4 WHERE id = $2`,
        [start_date_manager, process_id, comment, finish_date_manager],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  // static update3Manager({ comment, finish_date_manager, process_id }) {
  //   return new Promise((resolve, reject) => {
  //     pool.query(
  //       `UPDATE process_work SET comment = $1, finish_date_manager = $2 WHERE id = $3`,
  //       [comment, finish_date_manager, process_id],
  //       (error, response) => {
  //         if (error) return reject(error);
  //         resolve({ message: "success" });
  //       }
  //     );
  //   });
  // }
  static update4Admin({ process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE process_work SET is_done_1_admin = true, finish_date1_admin = NOW() WHERE id = $1`,
        [process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static update4Zahiral({ process_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE process_work SET is_done_2_admin = true, finish_date2_admin = NOW() WHERE id = $1`,
        [process_id],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
  static updateAdminSpecial({ process_id, is_start_1_admin, is_done_1_admin }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE process_work SET is_start_1_admin = $2, start_date1_admin = NOW(), is_done_1_admin = $3, finish_date1_admin = NOW() WHERE id = $1`,
        [process_id, is_start_1_admin, is_done_1_admin],
        (error, response) => {
          if (error) return reject(error)
          resolve({ message: "success" })
        }
      )
    })
  }
}

module.exports = ProcessWorkTable
