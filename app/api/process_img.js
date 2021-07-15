const { Router } = require("express");
const router = new Router();
const multer = require("multer");
const path = require("path");

const ProcessImgTable = require("../process_img/table");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../assets/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.substring(1 + file.originalname.lastIndexOf("."))
    );
  },
});

var upload = multer({ storage: storage });

router.post("/insert", upload.single("file"), (req, res, next) => {
  const { process_id } = req.body;
  const img_url = "http://103.119.92.48:3050/" + req.file.filename;
  ProcessImgTable.insert({ process_id, img_url })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/insertMany", upload.any(), (req, res, next) => {
  const { id } = req.body;
  let process_id = parseInt(id);
  // console.log(typeof process_id);
  // console.log(typeof parseInt(process_id));
  const urlArray = [];
  req.files.forEach((file) => {
    urlArray.push({
      urlImage: "http://103.119.92.48:3050/" + file.filename,
    });
  });
  // const img_url = "http://103.119.92.48:3050/" + req.file.filename;
  urlArray.forEach((item) => {
    let img_url = item.urlImage;
    ProcessImgTable.insert({ process_id, img_url })
      .then(({ message }) => {
        res.json({ message });
      })
      .catch((error) => next(error));
  });
});

router.post("/getAllById", (req, res, next) => {
  const { process_id } = req.body;
  ProcessImgTable.getAllById({ process_id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
