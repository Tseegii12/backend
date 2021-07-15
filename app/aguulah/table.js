const pool = require("../../databasePool");

class AguulahTable {
  //admin
  static insert({
    material_id,
    material_too,
    material_une,
    date,
    project_id,
    nyarav_id,
    buy_place_id,
    padan_dugaar,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO aguulah(material_id, material_too, material_une, date, project_id, nyarav_id, buy_place_id, padan_dugaar) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          material_id,
          material_too,
          material_une,
          date,
          project_id,
          nyarav_id,
          buy_place_id,
          padan_dugaar,
        ],
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
        `SELECT aguulah.*, project.name as pj_name, users.name as nyarav_name, buy_place.name as gazar_name,
        material.name as material_name FROM aguulah
        INNER JOIN project ON project.id = aguulah.project_id 
        INNER JOIN users ON users.id = aguulah.nyarav_id 
        INNER JOIN material ON material.id = aguulah.material_id
        INNER JOIN buy_place ON buy_place.id = aguulah.buy_place_id`,
        [],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getAllFalse() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT aguulah.*, project.name as pj_name, users.name as nyarav_name, buy_place.name as gazar_name,
        material.name as material_name FROM aguulah
        INNER JOIN project ON project.id = aguulah.project_id 
        INNER JOIN users ON users.id = aguulah.nyarav_id 
        INNER JOIN material ON material.id = aguulah.material_id
        INNER JOIN buy_place ON buy_place.id = aguulah.buy_place_id
        WHERE aguulah.is_checked=false`,
        [],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getAllByPadan() {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT distinct on(aguulah.padan_dugaar) padan_dugaar,
        project.name as pj_name, users.name as nyarav_name, users.id as nyarav_id from aguulah
        INNER JOIN project ON project.id = aguulah.project_id 
        INNER JOIN users ON users.id = aguulah.nyarav_id
        WHERE aguulah.is_checked = false`,
        [],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getAllByPadanWithUser({ nyarav_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT distinct on(aguulah.padan_dugaar) padan_dugaar,
        project.name as pj_name, users.name as nyarav_name, users.id as nyarav_id from aguulah
        INNER JOIN project ON project.id = aguulah.project_id 
        INNER JOIN users ON users.id = aguulah.nyarav_id
        WHERE aguulah.nyarav_id=$1 AND aguulah.is_checked = false`,
        [nyarav_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getAllByPadanWithParam({ padan_dugaar, nyarav_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT aguulah.*, project.name as pj_name, users.name as nyarav_name, buy_place.name as gazar_name,
        material.name as material_name FROM aguulah
        INNER JOIN project ON project.id = aguulah.project_id 
        INNER JOIN users ON users.id = aguulah.nyarav_id 
        INNER JOIN material ON material.id = aguulah.material_id
        INNER JOIN buy_place ON buy_place.id = aguulah.buy_place_id
        WHERE aguulah.padan_dugaar = $1 AND aguulah.nyarav_id = $2`,
        [padan_dugaar, nyarav_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static update({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE aguulah SET is_checked = true WHERE id = $1`,
        [id],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }
  static updateByNyarav({
    id,
    material_too,
    material_une,
    date,
    padan_dugaar,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE aguulah SET material_too = $2, material_une = $3, date=$4, padan_dugaar = $5 WHERE id = $1`,
        [id, material_too, material_une, date, padan_dugaar],
        (error, response) => {
          if (error) return reject(error);
          resolve({ message: "success" });
        }
      );
    });
  }

  static getUldegdelByPjMaterial({ project_id, material_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT get_baraa_uldegdel($2, $1)`,
        [project_id, material_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  static getUldegdelByPj({ project_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select table3.*, material.*, table3.aguulah_niit-table3.ashiglasan_niit as uldegdel from (
          select table1.*, table2.* from (
            select sum(material_too) as aguulah_niit, material_id as a_material_id from aguulah where project_id = $1 and is_checked=true group by material_id
          ) as table1 
          left join (
            select sum(material_too) as ashiglasan_niit, material_id as n_material_id from nyagtlan_material group by material_id
          ) as table2 on table1.a_material_id = table2.n_material_id) as table3
          inner join material on table3.a_material_id = material.id`,
        [project_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  static getUldegdelAll() {
    return new Promise((resolve, reject) => {
      pool.query(
        `select table3.*, project.name as pj_name, material.name, material.code, table3.aguulah_niit-table3.ashiglasan_niit as uldegdel from (
          select table1.*, table2.* from (
                  select sum(material_too) as aguulah_niit, material_id as a_material_id, project_id from aguulah
              where is_checked=true group by material_id, project_id
          ) as table1 
          left join (
                  select sum(material_too) as ashiglasan_niit, material_id as n_material_id from nyagtlan_material group by material_id
          ) as table2 on table1.a_material_id = table2.n_material_id) as table3
          inner join material on table3.a_material_id = material.id
          inner join project on table3.project_id = project.id
          order by pj_name`,
        [],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }

  //mobile
  static getAllByPj({ project_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT aguulah.*, project.name as pj_name, users.name as nyarav_name, buy_place.name as gazar_name,
        material.name as material_name FROM aguulah
        INNER JOIN project ON project.id = aguulah.project_id 
        INNER JOIN users ON users.id = aguulah.nyarav_id 
        INNER JOIN material ON material.id = aguulah.material_id
        INNER JOIN buy_place ON buy_place.id = aguulah.buy_place_id
        WHERE aguulah.project_id = $1`,
        [project_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
}

module.exports = AguulahTable;
