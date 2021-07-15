const { Router } = require("express");
var moment = require("moment"); // require
const router = new Router();
const AguulahPlaceTable = require("../aguulah_place/table");

router.post("/insert", (req, res, next) => {
  const { name } = req.body;
  AguulahPlaceTable.insert({
    name,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  AguulahPlaceTable.getAll()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, id } = req.body;
  AguulahPlaceTable.update({
    name,
    id,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  AguulahPlaceTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

module.exports = router;
