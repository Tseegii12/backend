const { Router } = require("express");
const router = new Router();
const BuyPlaceTable = require("../buyPlace/table");

router.post("/insert", (req, res, next) => {
  const { name, aguulah_place_id } = req.body;
  BuyPlaceTable.insert({ name, aguulah_place_id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, aguulah_place_id, id } = req.body;
  BuyPlaceTable.update({ name, aguulah_place_id, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  BuyPlaceTable.getAll()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  BuyPlaceTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

module.exports = router;
