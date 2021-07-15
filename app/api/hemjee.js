const { Router } = require("express");
const router = new Router();
const HemjeeTable = require("../hemjee/table");

//admin
router.post("/insert", (req, res, next) => {
  const { name } = req.body;
  HemjeeTable.insert({ name })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  HemjeeTable.getAll()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, id } = req.body;
  HemjeeTable.update({ name, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  HemjeeTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

//mobile

module.exports = router;
