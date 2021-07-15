const { Router, response } = require("express");
const router = new Router();
const queryIrtsTable = require("../irts/queryTable");
var moment = require("moment"); // require

router.post("/get1", (req, res, next) => {
  const { date1, date2 } = req.body;
  queryIrtsTable
    .get1({ date1, date2 })
    .then((response1) => {
      queryIrtsTable
        .get1CountTsalin({ date1, date2 })
        .then((response2) => {
          queryIrtsTable
            .get1CountAjilchin({ date1, date2 })
            .then((response3) => {
              res.json({
                sheet: response1,
                totalTsalin: response2.niit_tsalin,
                totalAjilchin: response3.niit_ajilchin,
              });
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.post("/get2", (req, res, next) => {
  const { date1, date2, pj_id } = req.body;
  queryIrtsTable
    .get2({ date1, date2, pj_id })
    .then((response1) => {
      queryIrtsTable
        .get2TotalAjilchin({ date1, date2, pj_id })
        .then((response2) => {
          queryIrtsTable
            .get2TotalAjilajBga({ date1, date2, pj_id })
            .then((response3) => {
              queryIrtsTable
                .get2TotalTsalin({ date1, date2, pj_id })
                .then((response4) => {
                  res.json({
                    sheet: response1,
                    totalAjillajBga: response3.count,
                    totalAjilchin: response2.count,
                    totalTsalin: response4.sum,
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

router.post("/get3", (req, res, next) => {
  const { date1, date2, pj_id, manager_id } = req.body;
  queryIrtsTable
    .get3({ date1, date2, pj_id, manager_id })
    .then((response1) => {
      queryIrtsTable
        .get3TotalTsalin({ date1, date2, pj_id, manager_id })
        .then((response2) => {
          res.json({
            sheet: response1,
            totalTsalin: response2.sum,
          });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.post("/get4", (req, res, next) => {
  const { in_time, pj_id } = req.body;
  let array = [];
  queryIrtsTable
    .get4({ in_time, pj_id })
    .then((response1) => {
      response1.forEach((item) => {
        let obj = {};
        obj.huruu_hee = item.huruu_hee;
        obj.ner = item.ner;
        obj.manager_name = item.manager_name;
        obj.alban_tushaal = item.alban_tushaal;
        obj.date = moment(item.date).format("MM/DD/YYYY");
        obj.in_time = moment(item.in_time).format("hh:mm");
        obj.out_time = moment(item.out_time).format("hh:mm");
        obj.tuluv = item.tuluv_ner;
        array.push(obj);
      });
      queryIrtsTable
        .get4Total({ in_time, pj_id })
        .then((response2) => {
          res.json({
            sheet: array,
            total: response2,
          });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.post("/get5", (req, res, next) => {
  const { date, dateStart, pj_id } = req.body;
  let array = [];
  let array2 = [];
  queryIrtsTable
    .get5Honoson({ date, pj_id })
    .then((response1) => {
      response1.forEach((item) => {
        let obj = {
          huruu_hee: item.huruu_hee,
          ner: item.ner,
          manager_name: item.manager_name,
          alban_tushaal: item.alban_tushaal,
          date: moment(item.date).format("MM/DD/YYYY"),
          in_time: moment(item.in_time).format("hh:mm"),
          out_time: moment(item.out_time).format("hh:mm"),
          tuluv: item.tuluv_ner,
        };

        array.push(obj);
      });
      queryIrtsTable
        .get5Iluu({ date, dateStart, pj_id })
        .then((response2) => {
          response2.forEach((item) => {
            let obj = {
              huruu_hee: item.huruu_hee,
              ner: item.ner,
              manager_name: item.manager_name,
              alban_tushaal: item.alban_tushaal,
              date: moment(item.date).format("MM/DD/YYYY"),
              in_time: moment(item.in_time).format("hh:mm"),
              out_time: moment(item.out_time).format("hh:mm"),
              tuluv: item.tuluv_ner,
            };

            array2.push(obj);
          });
          res.json({
            honoson: array,
            iluu: array2,
          });
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

module.exports = router;
