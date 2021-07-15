const { Router } = require("express");
const router = new Router();
const WorkerTable = require("../worker/table");

//admin
router.post("/insert", (req, res, next) => {
  const {
    ovog,
    ner,
    register,
    utas_dugaar,
    alban_tushaal,
    manager_id,
    udur_tsalin,
    niigmiin_daatgal,
    eruul_mend_daatgal,
    ajild_orson_ognoo,
    comment,
    tuluv_id,
    huruu_code,
  } = req.body;
  WorkerTable.insert({
    ovog,
    ner,
    register,
    utas_dugaar,
    alban_tushaal,
    manager_id,
    udur_tsalin,
    niigmiin_daatgal,
    eruul_mend_daatgal,
    ajild_orson_ognoo,
    comment,
    tuluv_id,
    huruu_code,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  WorkerTable.getAll()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/getAllByManager", (req, res, next) => {
  const { manager_id } = req.body;
  WorkerTable.getAllByManager({ manager_id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  WorkerTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

router.post("/update", (req, res, next) => {
  const {
    ovog,
    ner,
    register,
    utas_dugaar,
    alban_tushaal,
    manager_id,
    udur_tsalin,
    niigmiin_daatgal,
    eruul_mend_daatgal,
    ajild_orson_ognoo,
    comment,
    tuluv_id,
    id,
    huruu_code,
  } = req.body;
  WorkerTable.update({
    ovog,
    ner,
    register,
    utas_dugaar,
    alban_tushaal,
    manager_id,
    udur_tsalin,
    niigmiin_daatgal,
    eruul_mend_daatgal,
    ajild_orson_ognoo,
    comment,
    tuluv_id,
    id,
    huruu_code,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getRandomHee", (req, res, next) => {
  WorkerTable.getRandomHee()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
