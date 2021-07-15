const { Router } = require("express");
const router = new Router();
const floorTable = require("../floor/table");

//admin
router.post("/insert", (req, res, next) => {
  const { name } = req.body;
  floorTable
    .insert({ name })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  floorTable
    .getAll()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, id } = req.body;
  floorTable
    .update({ name, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  floorTable
    .delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

module.exports = router;
