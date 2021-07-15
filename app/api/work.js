const { Router } = require("express");
const router = new Router();
const WorkTable = require("../work/table");

router.post("/insert", (req, res, next) => {
  const { name, work_type_id } = req.body;
  WorkTable.insert({ name, work_type_id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, work_type_id, id } = req.body;
  WorkTable.update({ name, work_type_id, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  WorkTable.getAll()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  WorkTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

router.post("/getAllForPicker", (req, res, next) => {
  const { process_id } = req.body;
  let workData = [];
  WorkTable.getWorkByProcess({ process_id })
    .then((result) => {
      result.forEach((element) => {
        let workObj = { label: element.name, value: element.id };
        workData.push(workObj);
      });
      res.json({ workData });
    })
    .catch((error) => next(error));
});

router.get("/getAllWithPName", (req, res, next) => {
  WorkTable.getAllWithPName()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
