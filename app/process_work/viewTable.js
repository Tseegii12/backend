const pool = require("../../databasePool");

class ProcessWorkViewTable {
  //admin
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, manager.name as manager_name, admin.name as admin_name, units.name as unit_name, units.pj_name, 
        units.block_name from process_work
        inner join (
              select field_work.*,
             work.name as work_name, field.name as field_name, zagvar.name as zagvar_name, hemjee.name as hemjee_name from field_work 
             inner join work on field_work.work_id = work.id
             inner join field on field_work.field_id = field.id
             inner join zagvar on field_work.zagvar_id = zagvar.id
             inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join (
          select unit.*, project.name as pj_name, block.name as block_name from unit
          inner join project on unit.project_id = project.id
          inner join block on unit.block_id = block.id) as units on process_work.unit_id = units.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id`,
        [],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getAllByManagerID({ manager_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, manager.name as manager_name, admin.name as admin_name, units.name as unit_name, units.pj_name, 
        units.block_name from process_work
        inner join (
              select field_work.*,
             work.name as work_name, field.name as field_name, zagvar.name as zagvar_name, hemjee.name as hemjee_name from field_work 
             inner join work on field_work.work_id = work.id
             inner join field on field_work.field_id = field.id
             inner join zagvar on field_work.zagvar_id = zagvar.id
             inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join (
          select unit.*, project.name as pj_name, block.name as block_name from unit
          inner join project on unit.project_id = project.id
          inner join block on unit.block_id = block.id) as units on process_work.unit_id = units.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        WHERE process_work.manager_id = $1`,
        [manager_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getAllTest() {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name, 
        field_works.hemjee_name, field_works.material_name, field_works.material_code, field_works.f_material_too,
        process_material.material_too as l_material_too, process_material.date as process_material_date,
        manager.name as manager_name, admin.name as admin_name, units.name as unit_name, units.pj_name,
        units.block_name from process_work
        inner join (
             select field_work.*,
             work.name as work_name, field.name as field_name, zagvar.name as zagvar_name, hemjee.name as hemjee_name,
             field_materials.material_name, field_materials.material_code, field_materials.material_too as f_material_too from field_work 
             inner join work on field_work.work_id = work.id
             inner join field on field_work.field_id = field.id
             inner join zagvar on field_work.zagvar_id = zagvar.id
             inner join hemjee on field_work.hemjih_negj_id = hemjee.id
             left join (
                  select field_material.*, material.name as material_name, material.code as material_code from field_material
                  inner join material on field_material.material_id = material.id) 
                  as field_materials on field_work.work_id = field_materials.work_id
                  and field_work.field_id = field_materials.field_id and field_work.zagvar_id = field_materials.zagvar_id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join (
             select unit.*, project.name as pj_name, block.name as block_name from unit
             inner join project on unit.project_id = project.id
             inner join block on unit.block_id = block.id) as units on process_work.unit_id = units.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        left join process_material on process_work.id = process_material.process_work_id`,
        [],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  //mobile
  static getProcessWorks({ unit_id, field_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, manager.name as manager_name, admin.name as admin_name, unit.name as unit_name from process_work
        inner join (
            select field_work.*,
            work.name as work_name, field.name as field_name, zagvar.name as zagvar_name, hemjee.name as hemjee_name from field_work 
            inner join work on field_work.work_id = work.id
            inner join field on field_work.field_id = field.id
            inner join zagvar on field_work.zagvar_id = zagvar.id
            inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join unit on process_work.unit_id = unit.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        where process_work.unit_id = $1 and field_works.field_id = $2`,
        [unit_id, field_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getProcessWorksSearch({ unit_id, field_id, manager_id, is_done }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, manager.name as manager_name, admin.name as admin_name, unit.name as unit_name from process_work
        inner join (
            select field_work.*,
            work.name as work_name, field.name as field_name, zagvar.name as zagvar_name, hemjee.name as hemjee_name from field_work 
            inner join work on field_work.work_id = work.id
            inner join field on field_work.field_id = field.id
            inner join zagvar on field_work.zagvar_id = zagvar.id
            inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join unit on process_work.unit_id = unit.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        where process_work.unit_id = $1 and field_works.field_id = $2 and
        process_work.manager_id = $3 and (process_work.is_done_1_admin = $4 or process_work.is_done_2_admin = $4)`,
        [unit_id, field_id, manager_id, is_done],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getProcessWorks1({ project_id, block_id, type }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, field_works.zagvar_turul_id, manager.name as manager_name, admin.name as admin_name, 
        unit.name as unit_name from process_work
        inner join (
                    select field_work.*,
                    work.name as work_name, field.name as field_name, table1.name as zagvar_name,
              table1.zagvar_turul_id, hemjee.name as hemjee_name from field_work 
                    inner join work on field_work.work_id = work.id
                    inner join field on field_work.field_id = field.id
                    inner join 
                (select zagvar.*, zagvar_turul.name as zagvar_turul_name from zagvar
                inner join zagvar_turul on zagvar.zagvar_turul_id = zagvar_turul.id) as table1
              on field_work.zagvar_id = table1.id
                    inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join unit on process_work.unit_id = unit.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        where unit.project_id = $1 and unit.block_id = $2 and field_works.zagvar_turul_id = $3`,
        [project_id, block_id, type],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getProcessWorks2({ project_id, block_id, type, floor_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, field_works.zagvar_turul_id, manager.name as manager_name, admin.name as admin_name, 
        unit.name as unit_name from process_work
        inner join (
                    select field_work.*,
                    work.name as work_name, field.name as field_name, table1.name as zagvar_name,
              table1.zagvar_turul_id, hemjee.name as hemjee_name from field_work 
                    inner join work on field_work.work_id = work.id
                    inner join field on field_work.field_id = field.id
                    inner join 
                (select zagvar.*, zagvar_turul.name as zagvar_turul_name from zagvar
                inner join zagvar_turul on zagvar.zagvar_turul_id = zagvar_turul.id) as table1
              on field_work.zagvar_id = table1.id
                    inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join unit on process_work.unit_id = unit.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        where unit.project_id = $1 and unit.block_id = $2 and field_works.zagvar_turul_id = $3 and unit.floor_id = $4`,
        [project_id, block_id, type, floor_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getProcessWorks3({ manager_id, unit_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, manager.name as manager_name, admin.name as admin_name,
        unit.name as unit_name from process_work
        inner join (
            select field_work.*,
            work.name as work_name, field.name as field_name, zagvar.name as zagvar_name,
          hemjee.name as hemjee_name from field_work 
            inner join work on field_work.work_id = work.id
            inner join field on field_work.field_id = field.id
            inner join zagvar on field_work.zagvar_id = zagvar.id
            inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join unit on process_work.unit_id = unit.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        where manager_id = $1 and unit_id = $2`,
        [manager_id, unit_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getProcessWorks3Search({ manager_id, unit_id, trueA, trueB }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select process_work.*,
        field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
        field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name,
        field_works.hemjee_name, manager.name as manager_name, admin.name as admin_name,
        unit.name as unit_name from process_work
        inner join (
            select field_work.*,
            work.name as work_name, field.name as field_name, zagvar.name as zagvar_name,
          hemjee.name as hemjee_name from field_work 
            inner join work on field_work.work_id = work.id
            inner join field on field_work.field_id = field.id
            inner join zagvar on field_work.zagvar_id = zagvar.id
            inner join hemjee on field_work.hemjih_negj_id = hemjee.id
        ) as field_works on process_work.field_work_id = field_works.id
        inner join unit on process_work.unit_id = unit.id
        left join users as manager on process_work.manager_id = manager.id
        left join users as admin on process_work.admin_id = admin.id
        where manager_id = $1 and unit_id = $2 and
        (process_work.is_start_1_admin = $3 or process_work.is_start_2_admin = $3) and
        (process_work.is_done_1_admin = $4 or process_work.is_done_2_admin = $4)`,
        [manager_id, unit_id, trueA, trueB],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
  static getAllByPWid({ process_work_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select superTable.*, process_material.material_too as l_material_too, process_material.date as process_material_date from (select process_work.*,
          field_works.zagvar_id, field_works.work_id, field_works.field_id, field_works.hemjee,
          field_works.hemjih_negj_id, field_works.work_name, field_works.field_name, field_works.zagvar_name, 
          field_works.hemjee_name, field_works.material_id, field_works.material_name, field_works.material_code, field_works.f_material_too,
          manager.name as manager_name, admin.name as admin_name, units.name as unit_name, units.pj_name,
          units.block_name from process_work
          inner join (
                       select field_work.*,
                       work.name as work_name, field.name as field_name, zagvar.name as zagvar_name, hemjee.name as hemjee_name,
                       field_materials.material_name, field_materials.material_code,
                 field_materials.material_id, field_materials.material_too as f_material_too from field_work 
                       inner join work on field_work.work_id = work.id
                       inner join field on field_work.field_id = field.id
                       inner join zagvar on field_work.zagvar_id = zagvar.id
                       inner join hemjee on field_work.hemjih_negj_id = hemjee.id
                       left join (
                            select field_material.*, material.name as material_name, material.code as material_code from field_material
                            inner join material on field_material.material_id = material.id) 
                            as field_materials on field_work.work_id = field_materials.work_id
                            and field_work.field_id = field_materials.field_id and field_work.zagvar_id = field_materials.zagvar_id
          ) as field_works on process_work.field_work_id = field_works.id
          inner join (
                       select unit.*, project.name as pj_name, block.name as block_name from unit
                       inner join project on unit.project_id = project.id
                       inner join block on unit.block_id = block.id) as units on process_work.unit_id = units.id
          left join users as manager on process_work.manager_id = manager.id
          left join users as admin on process_work.admin_id = admin.id
          where process_work.id = $1) as superTable
          left join process_material on superTable.id = process_material.process_work_id and superTable.material_id = process_material.material_id
          `,
        [process_work_id],
        (error, response) => {
          if (error) return reject(error);
          resolve(response.rows);
        }
      );
    });
  }
}

module.exports = ProcessWorkViewTable;
