const { Router } = require("express");
const router = new Router();
const WorkTypeTable = require("../work_type/table");

router.post("/insert", (req, res, next) => {
  const { name } = req.body;
  WorkTypeTable.insert({ name })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  WorkTypeTable.getAll()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, id } = req.body;
  WorkTypeTable.update({ name, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  WorkTypeTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

module.exports = router;
