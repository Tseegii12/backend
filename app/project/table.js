const pool = require("../../databasePool");

class ProjectTable {
  //admin
  static insert({ name }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO project(name) VALUES($1)`,
        [name],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }
  static update({ name, id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE project SET name = $1 WHERE id = $2`,
        [name, id],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM project ORDER BY name`, [], (error, response) => {
        if (error) return reject(error);
        resolve(response.rows);
      });
    });
  }

  static delete({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM project WHERE id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }

  //mobile
}

module.exports = ProjectTable;
