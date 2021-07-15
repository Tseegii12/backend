const { Router } = require("express");
const router = new Router();
// const multer = require("multer");
// const path = require("path");

const FieldWorkTable = require("../field_work/table");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../../../assets/"));
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname +
//         "-" +
//         Date.now() +
//         "." +
//         file.originalname.substring(1 + file.originalname.lastIndexOf("."))
//     );
//   },
// });

// var upload = multer({ storage: storage });

router.post("/insert", (req, res, next) => {
  const { work_id, hemjee, hemjih_negj_id, field_id, zagvar_id } = req.body;
  FieldWorkTable.insert({
    work_id,
    hemjee,
    hemjih_negj_id,
    field_id,
    zagvar_id,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { work_id, hemjee, hemjih_negj_id, field_id, zagvar_id, id } = req.body;
  FieldWorkTable.update({
    work_id,
    hemjee,
    hemjih_negj_id,
    field_id,
    zagvar_id,
    id,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  FieldWorkTable.getAll()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/delete", (req, res, next) => {
  const { id } = req.body;
  FieldWorkTable.delete({ id })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => {
      res.json({ error: error.code });
      next(error);
    });
});

module.exports = router;
