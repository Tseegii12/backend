const { Router } = require("express");
const router = new Router();
var moment = require("moment"); // require
const NyagtlanMaterialTable = require("../nyagtlan_material/table");

router.post("/insert", (req, res, next) => {
  const {
    process_work_id,
    material_id,
    material_too,
    date,
    nyarav_id,
  } = req.body;
  NyagtlanMaterialTable.insert({
    process_work_id,
    material_id,
    material_too,
    date,
    nyarav_id,
  })
    .then(({ message }) => {
      res.json({ message });
    })
    .catch((error) => next(error));
});

// router.post("/getMaterialByWorkId", (req, res, next) => {
//   const { field_work_id } = req.body;
//   let arr1 = [];
//   WorkMaterialTable.getMaterialByWorkId({ field_work_id })
//     .then((result) => {
//       result.forEach((itemResult) => {
//         let arr2 = [];
//         arr2.push(itemResult.material_name);
//         if (itemResult.date !== null) {
//           arr2.push(moment(itemResult.date).format("MM/DD/YYYY"));
//         } else {
//           arr2.push(itemResult.date);
//         }
//         arr2.push(itemResult.material_too);
//         arr2.push(itemResult.material_used);
//         arr2.push(itemResult.id);
//         arr1.push(arr2);
//       });
//       res.json(arr1);
//     })
//     .catch((error) => next(error));
// });

module.exports = router;
