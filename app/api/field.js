const { Router } = require("express");
const router = new Router();
const FieldTable = require("../field/table");

//admin
router.post("/insert", (req, res, next) => {
  const { name } = req.body;
  FieldTable.insert({
    name,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  FieldTable.getField()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, id } = req.body;
  FieldTable.update({
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
  FieldTable.delete({ id })
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
