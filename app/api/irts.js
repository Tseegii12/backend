const { Router, response } = require("express");
const router = new Router();
const IrtsTable = require("../irts/table");
var moment = require("moment"); // require

//admin
router.post("/insert", (req, res, next) => {
  const { worker_id, tsalin, tuluv_id, data } = req.body;
  // console.log(data);
  // data.forEach((item) => {
  //   IrtsTable.insert({
  //     worker_id: item.id,
  //     tsalin: item.udur_tsalin,
  //     tuluv_id: item.current_tuluv_id,
  //   })
  //     .then(({ message }) => {
  //       res.json({ message });
  //     })
  //     .catch((error) => next(error));
  // });
  // res.json("ok");
  IrtsTable.insert({ data })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.post("/update", (req, res, next) => {
  const { tuluv_id, id, data } = req.body;
  IrtsTable.update({
    tuluv_id,
    id,
    data,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

router.get("/testTable", (req, res, next) => {
  IrtsTable.deleteIrtsTotal()
    .then(({ message }) => {
      if (message === "success") {
        IrtsTable.getAllDistinct()
          .then((response1) => {
            response1.forEach((item, index) => {
              IrtsTable.getAllCountDistinct(item.manager_id).then(
                (response2) => {
                  let innerArray = [];
                  innerArray.push(item.manager_id);
                  innerArray.push(item.manager_name);
                  innerArray.push(item.pj_name);
                  response2.forEach((item2, index2) => {
                    innerArray.push(item2.count);
                    innerArray.push(item2.tuluv_ner);
                  });
                  let manager_id = innerArray[0];
                  let manager_name = innerArray[1];
                  let pj_name = innerArray[2];
                  let irsen = "";
                  let uvchtei = "";
                  let tasalsan = "";
                  let chuluutei = "";
                  if (innerArray[4] === "Ирсэн") {
                    irsen = innerArray[3];
                  }
                  if (innerArray[6] === "Өвчтэй") {
                    uvchtei = innerArray[5];
                  } else if (innerArray[4] === "Өвчтэй") {
                    uvchtei = innerArray[3];
                  }
                  if (innerArray[8] === "Тасалсан") {
                    tasalsan = innerArray[7];
                  } else if (innerArray[6] === "Тасалсан") {
                    tasalsan = innerArray[5];
                  } else if (innerArray[4] === "Тасалсан") {
                    tasalsan = innerArray[3];
                  }
                  if (innerArray[10] === "Чөлөөтэй") {
                    chuluutei = innerArray[9];
                  } else if (innerArray[8] === "Чөлөөтэй") {
                    chuluutei = innerArray[7];
                  } else if (innerArray[6] === "Чөлөөтэй") {
                    chuluutei = innerArray[5];
                  } else if (innerArray[4] === "Чөлөөтэй") {
                    chuluutei = innerArray[3];
                  }
                  IrtsTable.insertIrtsTotal({
                    manager_id,
                    manager_name,
                    pj_name,
                    irsen,
                    uvchtei,
                    tasalsan,
                    chuluutei,
                  })
                    .then(({ message }) => {})
                    .catch((error) => next(error));
                }
              );
              IrtsTable.getAllCountDistinctDate(item.manager_id).then(
                (res4) => {
                  let innerArray = [];
                  innerArray.push(item.manager_id);
                  innerArray.push(item.manager_name);
                  innerArray.push(item.pj_name);
                  res4.forEach((item2, index2) => {
                    innerArray.push(item2.count);
                    innerArray.push(item2.tuluv_ner);
                    innerArray.push(item2.date);
                  });
                  console.log("?", innerArray);
                }
              );
            });
            res.json({ aaa: "123" });
          })

          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

router.get("/getIrtsTotal", (req, res, next) => {
  IrtsTable.getIrtsTotal()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

router.post("/getBySearch", (req, res, next) => {
  const { dateStart, dateFinish, pj_id, manager_id } = req.body;
  let arrHusnegtData = [];
  let arrHusnegtHeader = [
    "#",
    "Төсөл",
    "Овог",
    "Нэр",
    "Албан тушаал",
    "Өдөр",
    "Төлөв",
  ];
  IrtsTable.getBySearch({
    dateStart,
    dateFinish,
    pj_id,
    manager_id,
  })
    .then((response1) => {
      let array = [];
      response1.forEach((item, index) => {
        let obj = {};
        obj.ovog = item.ovog;
        obj.ner = item.ner;
        obj.utas = item.utas_dugaar;
        obj.alban_tushaal = item.alban_tushaal;
        obj.date = moment(item.date).format("MM/DD/YYYY");
        obj.tuluv_ner = item.tuluv_ner;
        obj.manager_name = item.manager_name;
        obj.huruu_hee = item.huruu_hee;
        obj.in_time = moment(item.in_time).format("hh:mm");
        obj.out_time = moment(item.out_time).format("hh:mm");
        array.push(obj);
      });
      IrtsTable.getBySearchTuluv({
        dateStart,
        dateFinish,
        pj_id,
        manager_id,
      })
        .then((response2) => {
          IrtsTable.getBySearchCount({
            dateStart,
            dateFinish,
            pj_id,
            manager_id,
          })
            .then((response3) => {
              IrtsTable.getBySearchCountAll({
                dateStart,
                dateFinish,
                pj_id,
                manager_id,
              })
                .then((response4) => {
                  res.json({
                    reactHusnegt: array,
                    husnegt: arrHusnegtData,
                    husnegtHeader: arrHusnegtHeader,
                    tabNer: response2,
                    too: response3,
                    niitToo: response4,
                  });
                })
                .catch((error) => next(error));
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.get("/getAll", (req, res, next) => {
  let array = [];
  IrtsTable.getAll()
    .then((result) => {
      result.forEach((item) => {
        let obj = {};
        obj.ovog = item.ovog;
        obj.ner = item.ner;
        obj.utas = item.utas_dugaar;
        obj.alban_tushaal = item.alban_tushaal;
        obj.date = moment(item.date).format("MM/DD/YYYY");
        obj.tuluv_ner = item.tuluv_ner;
        obj.manager_name = item.manager_name;
        obj.huruu_hee = item.huruu_hee;
        obj.in_time = moment(item.in_time).format("hh:mm");
        obj.out_time = moment(item.out_time).format("hh:mm");
        array.push(obj);
      });
      IrtsTable.getAllCount123()
        .then((response1) => {
          IrtsTable.getAllCount()
            .then((response2) => {
              IrtsTable.getSpecial()
                .then((response3) => {
                  res.json({
                    arraySpecial: response3,
                    array: array,
                    reactHusnegt: array,
                    niitToo: response2,
                    too: response1,
                  });
                })
                .catch((error) => next(error));
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.post("/getAllByManager", (req, res, next) => {
  const { manager_id, dateStart, dateFinish } = req.body;
  let array = [];
  IrtsTable.getAllByManager({ manager_id, dateStart, dateFinish })
    .then((result) => {
      result.forEach((item) => {
        let obj = {};
        obj.ovog = item.ovog;
        obj.ner = item.ner;
        obj.utas = item.utas_dugaar;
        obj.alban_tushaal = item.alban_tushaal;
        obj.date = moment(item.date).format("MM/DD/YYYY");
        obj.in_time = moment(item.in_time).format("hh:mm");
        obj.out_time = moment(item.out_time).format("hh:mm");
        obj.tuluv = item.tuluv_ner;
        array.push(obj);
      });
      res.json(array);
    })
    .catch((error) => next(error));
});

router.post("/getAllByManagerNow", (req, res, next) => {
  const { manager_id } = req.body;
  IrtsTable.getAllByManagerNow({ manager_id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

module.exports = router;
