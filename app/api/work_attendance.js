const { Router } = require("express");
const router = new Router();
var moment = require("moment"); // require
const WorkAttendanceTable = require("../work_attendance/table");

router.post("/insert", (req, res, next) => {
  const { user_id, date, salary } = req.body;
  WorkAttendanceTable.insert({ user_id, date, salary })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/getWorkersByPj", (req, res, next) => {
  const { project_id } = req.body;
  let arr1 = [];
  WorkAttendanceTable.getWorkersByPj({ project_id })
    .then((result) => {
      result.forEach((item) => {
        let arr2 = [];
        arr2.push(item.pj_name);
        arr2.push(item.name + " / " + item.type_name);
        arr2.push(moment(item.date).format("MM/DD/YYYY"));
        arr2.push(item.salary);
        arr1.push(arr2);
      });
      res.json(arr1);
    })
    .catch((error) => next(error));
});

module.exports = router;
