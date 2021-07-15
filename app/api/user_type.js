const { Router } = require("express");
const router = new Router();
const userTypeTable = require("../user_type/table");

router.post("/insert", (req, res, next) => {
  const { name } = req.body;
  userTypeTable
    .insert({ name })
    .then((result) => {
      res.json({ message: "success", result });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  userTypeTable
    .getType()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
