const { Router } = require("express");
const router = new Router();
const zagvarTable = require("../zagvar/table");

//admin
router.post("/insert", (req, res, next) => {
  const { name, zagvar_turul_id } = req.body;
  zagvarTable
    .insert({ name, zagvar_turul_id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  zagvarTable
    .getAll()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, zagvar_turul_id, id } = req.body;
  zagvarTable
    .update({ name, zagvar_turul_id, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  zagvarTable
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
