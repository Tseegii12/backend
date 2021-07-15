const { Router } = require("express");
const router = new Router();
const unitTable = require("../unit/table");

//admin
router.post("/insert", (req, res, next) => {
  const { name, block_id, zagvar_id, m2, project_id, floor_id } = req.body;
  unitTable
    .insert({ name, block_id, zagvar_id, m2, project_id, floor_id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  unitTable
    .getAll()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, block_id, zagvar_id, m2, project_id, floor_id, id } = req.body;
  unitTable
    .update({ name, block_id, zagvar_id, m2, project_id, floor_id, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  unitTable
    .delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

//mobile
router.post("/getAllByTurulBlock", (req, res, next) => {
  const { zagvar_turul_id, block_id, project_id } = req.body;
  unitTable
    .getAllByTurulBlock({ zagvar_turul_id, block_id, project_id })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/getAllByTurulBlockFloor", (req, res, next) => {
  const { zagvar_turul_id, block_id, project_id, floor_id } = req.body;
  console.log("?", req.body);
  unitTable
    .getAllByTurulBlockFloor({
      zagvar_turul_id,
      block_id,
      project_id,
      floor_id,
    })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/getAllByManager", (req, res, next) => {
  const { manager_id } = req.body;
  unitTable
    .getAllByManager({
      manager_id,
    })
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

module.exports = router;
