const { Router } = require("express");
const router = new Router();
const MaterialTable = require("../material/table");

router.post("/insert", (req, res, next) => {
  const { name, material_unit, code, material_type_id } = req.body;
  MaterialTable.insert({ name, material_unit, code, material_type_id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  MaterialTable.getAll()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { name, material_unit, code, material_type_id, id } = req.body;
  MaterialTable.update({ name, material_unit, code, material_type_id, id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  MaterialTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

router.get("/getAllForPicker", (req, res, next) => {
  let materialData = [];
  MaterialTable.getAll()
    .then((result) => {
      result.forEach((element) => {
        let materialObj = { label: element.name, value: element.id };
        materialData.push(materialObj);
      });
      res.json({ materialData });
    })
    .catch((error) => next(error));
});

module.exports = router;
