const { Router } = require("express");
var moment = require("moment"); // require
const router = new Router();
const TailanTable = require("../tailan/table");
const TailanTable2 = require("../tailan/table2");

router.post("/getAjilDelgerengui", (req, res, next) => {
  const { process_id, block_id } = req.body;
  let objDone = { objDoneArray: [], isDoneArray: [] };
  let objNotDone = { objNotDoneArray: [], isNotDoneArray: [] };
  TailanTable.getAjilDelgerengui({ process_id, block_id })
    .then((result) => {
      result.forEach((itemResult) => {
        if (itemResult.is_done === null || itemResult.is_done === false) {
          let isNotDoneObj = {
            work_name: itemResult.work_name,
            user_name: itemResult.user_name,
          };
          objNotDone.isNotDoneArray.push(Object.values(isNotDoneObj));
          objNotDone.objNotDoneArray.push(itemResult);
        } else {
          let isDoneObj = {
            work_name: itemResult.work_name,
            user_name: itemResult.user_name,
          };
          objDone.isDoneArray.push(Object.values(isDoneObj));
          objDone.objDoneArray.push(itemResult);
        }
      });
      res.json({ objDone, objNotDone });
    })
    .catch((error) => next(error));
});

router.post("/getAjilDelgerenguiByAil", (req, res, next) => {
  const { process_id, block_id, field_id } = req.body;
  let objDone = { objDoneArray: [], isDoneArray: [] };
  let objNotDone = { objNotDoneArray: [], isNotDoneArray: [] };
  let countDone = 0;
  let countNotDone = 0;
  let countAll = 0;
  TailanTable.getAjilDelgerenguiByAil({ process_id, block_id, field_id })
    .then((result) => {
      result.forEach((itemResult) => {
        countAll++;
        if (itemResult.is_done === null || itemResult.is_done === false) {
          let isNotDoneObj = {
            work_name: itemResult.work_name,
            user_name: itemResult.user_name,
          };
          countNotDone++;
          objNotDone.isNotDoneArray.push(Object.values(isNotDoneObj));
          objNotDone.objNotDoneArray.push(itemResult);
        } else {
          let isDoneObj = {
            work_name: itemResult.work_name,
            user_name: itemResult.user_name,
          };
          countDone++;
          objDone.isDoneArray.push(Object.values(isDoneObj));
          objDone.objDoneArray.push(itemResult);
        }
      });
      res.json({ objDone, objNotDone, countAll, countDone, countNotDone });
    })
    .catch((error) => next(error));
});

router.post("/getBaraaMaterial", (req, res, next) => {
  const { process_id, block_id } = req.body;
  let arr1 = [];
  if (process_id === 1) {
    TailanTable.getBaraaMaterial1({ process_id, block_id })
      .then((result) => {
        result.forEach((item) => {
          let arr2 = [];
          arr2.push(moment(item.date).format("MM/DD/YYYY"));
          arr1.push(arr2);
        });
        res.json(arr1);
      })
      .catch((error) => next(error));
  } else {
    TailanTable.getBaraaMaterial2({ process_id, block_id })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => next(error));
  }
});

router.post("/getAjilchid", (req, res, next) => {
  const { block_id } = req.body;
  TailanTable.getAjilchid({ block_id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/getAjilchidByWork", (req, res, next) => {
  const { block_id, user_id } = req.body;
  TailanTable.getAjilchidByWork({ block_id, user_id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/getRoomWorks", (req, res, next) => {
  const { field_room_id } = req.body;
  let arr1 = [];
  TailanTable2.getRoomWorks({ field_room_id })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = [];
        arr2.push(itemResult.pj_name);
        arr2.push(itemResult.block_name);
        arr2.push(itemResult.field_name);
        arr2.push(itemResult.room_name);
        arr2.push(itemResult.work_name);
        arr2.push(itemResult.user_name);
        arr2.push(itemResult.person_name);
        if (itemResult.start_date !== null) {
          arr2.push(moment(itemResult.start_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.start_date);
        }
        if (itemResult.finish_date !== null) {
          arr2.push(moment(itemResult.finish_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.finish_date);
        }
        if (itemResult.is_done) arr2.push("Дууссан");
        else arr2.push("Дуусаагүй");
        arr2.push(itemResult.id);
        arr1.push(arr2);
      });
      res.json(arr1);
    })
    .catch((error) => next(error));
});

router.post("/getFieldWorks", (req, res, next) => {
  const { field_id } = req.body;
  let arr1 = [];
  TailanTable2.getFieldWorks({ field_id })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = [];
        arr2.push(itemResult.pj_name);
        arr2.push(itemResult.block_name);
        arr2.push(itemResult.field_name);
        arr2.push(itemResult.room_name);
        arr2.push(itemResult.work_name);
        arr2.push(itemResult.user_name);
        arr2.push(itemResult.person_name);
        if (itemResult.start_date !== null) {
          arr2.push(moment(itemResult.start_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.start_date);
        }
        if (itemResult.finish_date !== null) {
          arr2.push(moment(itemResult.finish_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.finish_date);
        }
        arr2.push(itemResult.is_done);
        arr1.push(arr2);
      });
      res.json(arr1);
    })
    .catch((error) => next(error));
});

router.post("/getFieldWorksByProcess", (req, res, next) => {
  const { floor_number, block_id, process_id } = req.body;
  let arr1 = [];
  TailanTable2.getFieldWorksByProcess({ floor_number, block_id, process_id })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = [];
        arr2.push(itemResult.pj_name);
        arr2.push(itemResult.block_name);
        arr2.push(itemResult.field_name);
        arr2.push(itemResult.room_name);
        arr2.push(itemResult.work_name);
        arr2.push(itemResult.user_name);
        arr2.push(itemResult.person_name);
        if (itemResult.start_date !== null) {
          arr2.push(moment(itemResult.start_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.start_date);
        }
        if (itemResult.finish_date !== null) {
          arr2.push(moment(itemResult.finish_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.finish_date);
        }
        arr2.push(itemResult.is_done);
        arr1.push(arr2);
      });
      res.json(arr1);
    })
    .catch((error) => next(error));
});

router.post("/getFieldWorksByProcessSub", (req, res, next) => {
  const { block_id, process_id } = req.body;
  let arr1 = [];
  TailanTable2.getFieldWorksByProcessSub({ block_id, process_id })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = [];
        arr2.push(itemResult.pj_name);
        arr2.push(itemResult.block_name);
        arr2.push(itemResult.field_name);
        arr2.push(itemResult.room_name);
        arr2.push(itemResult.work_name);
        arr2.push(itemResult.user_name);
        arr2.push(itemResult.person_name);
        if (itemResult.start_date !== null) {
          arr2.push(moment(itemResult.start_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.start_date);
        }
        if (itemResult.finish_date !== null) {
          arr2.push(moment(itemResult.finish_date).format("MM/DD/YYYY"));
        } else {
          arr2.push(itemResult.finish_date);
        }
        arr2.push(itemResult.is_done);
        arr1.push(arr2);
      });
      res.json(arr1);
    })
    .catch((error) => next(error));
});

//niit baraanii uldegdeliig harah
router.post("/getBaraaUldegdel", (req, res, next) => {
  const { project_id, material_id } = req.body;
  TailanTable2.getBaraaUldegdel({ project_id, material_id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
