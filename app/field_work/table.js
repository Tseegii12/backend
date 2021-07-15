const pool = require("../../databasePool");

class FieldWorkTable {
  static insert({ work_id, hemjee, hemjih_negj_id, field_id, zagvar_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO field_work(work_id, hemjee, hemjih_negj_id, field_id, zagvar_id) VALUES($1, $2, $3, $4, $5)`,
        [work_id, hemjee, hemjih_negj_id, field_id, zagvar_id],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT field_work.*, work.name AS work_name, zagvar.name AS zagvar_name,
        field.name AS field_name, hemjee.name as hemjee_name FROM field_work
        INNER JOIN work ON field_work.work_id = work.id
        INNER JOIN zagvar ON field_work.zagvar_id = zagvar.id
        INNER JOIN hemjee ON field_work.hemjih_negj_id = hemjee.id
        LEFT JOIN field ON field_work.field_id = field.id`,
        [],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static update({ work_id, hemjee, hemjih_negj_id, field_id, zagvar_id, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE field_work SET work_id=$1, hemjee=$2, hemjih_negj_id=$3, field_id=$4, zagvar_id=$5 WHERE id=$6`,
        [work_id, hemjee, hemjih_negj_id, field_id, zagvar_id, id],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM field_work WHERE id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }
}

module.exports = FieldWorkTable;
