const { Router } = require("express")
const router = new Router()
var moment = require("moment") // require
const ProcessWorkTable = require("../process_work/table")
const ProcessWorkViewTable = require("../process_work/viewTable")

//admin
router.post("/insert", (req, res, next) => {
  const { field_work_id, unit_id, manager_id, admin_id } = req.body
  ProcessWorkTable.insert({ field_work_id, unit_id, manager_id, admin_id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  let array = []
  ProcessWorkViewTable.getAll()
    .then((response) => {
      response.forEach((item) => {
        let date1 = item.start_date1_admin
        if (date1 !== null) {
          date1 = moment(item.start_date1_admin).format("MM/DD/YYYY")
        }
        let date2 = item.finish_date1_admin
        if (date2 !== null) {
          date2 = moment(item.finish_date1_admin).format("MM/DD/YYYY")
        }
        let date3 = item.start_date_manager
        if (date3 !== null) {
          date3 = moment(item.start_date_manager).format("MM/DD/YYYY")
        }
        let date4 = item.finish_date_manager
        if (date4 !== null) {
          date4 = moment(item.finish_date_manager).format("MM/DD/YYYY")
        }
        let date5 = item.start_date2_admin
        if (date5 !== null) {
          date5 = moment(item.start_date2_admin).format("MM/DD/YYYY")
        }
        let date6 = item.finish_date2_admin
        if (date6 !== null) {
          date6 = moment(item.finish_date2_admin).format("MM/DD/YYYY")
        }
        let obj = {
          comment: item.comment,
          id: item.id,
          field_work_id: item.field_work_id,
          is_done_2_admin: item.is_done_2_admin,
          is_done_1_admin: item.is_done_1_admin,
          is_start_2_admin: item.is_start_2_admin,
          is_start_1_admin: item.is_start_1_admin,
          start_date_manager: date3,
          finish_date_manager: date4,
          start_date1_admin: date1,
          finish_date1_admin: date2,
          start_date2_admin: date5,
          finish_date2_admin: date6,
          admin_id: item.admin_id,
          manager_id: item.manager_id,
          unit_id: item.unit_id,
          zagvar_id: item.zagvar_id,
          work_id: item.work_id,
          field_id: item.field_id,
          hemjee: item.hemjee,
          hemjih_negj_id: item.hemjih_negj_id,
          work_name: item.work_name,
          field_name: item.field_name,
          zagvar_name: item.zagvar_name,
          hemjee_name: item.hemjee_name,
          manager_name: item.manager_name,
          admin_name: item.admin_name,
          unit_name: item.unit_name,
          pj_name: item.pj_name,
          block_name: item.block_name,
        }
        array.push(obj)
      })
      res.json(array)
    })
    .catch((error) => next(error))
})

router.post("/getAllByManagerID", (req, res, next) => {
  const { manager_id } = req.body
  let array = []
  ProcessWorkViewTable.getAllByManagerID({ manager_id })
    .then((response) => {
      response.forEach((item) => {
        let date1 = item.start_date1_admin
        if (date1 !== null) {
          date1 = moment(item.start_date1_admin).format("MM/DD/YYYY")
        }
        let date2 = item.finish_date1_admin
        if (date2 !== null) {
          date2 = moment(item.finish_date1_admin).format("MM/DD/YYYY")
        }
        let date3 = item.start_date2_admin
        if (date3 !== null) {
          date3 = moment(item.start_date2_admin).format("MM/DD/YYYY")
        }
        let date4 = item.finish_date2_admin
        if (date4 !== null) {
          date4 = moment(item.finish_date2_admin).format("MM/DD/YYYY")
        }
        let date5 = item.finish_date_manager
        if (date5 !== null) {
          date5 = moment(item.finish_date_manager).format("MM/DD/YYYY")
        }
        let date6 = item.start_date_manager
        if (date6 !== null) {
          date6 = moment(item.start_date_manager).format("MM/DD/YYYY")
        }
        let obj = {
          id: item.id,
          unit_name: item.unit_name,
          zagvar_name: item.zagvar_name,
          field_name: item.field_name,
          work_name: item.work_name,
          manager_name: item.manager_name,
          start_date1_admin: date1,
          finish_date1_admin: date2,
          start_date2_admin: date3,
          finish_date2_admin: date4,
          is_start_1_admin: item.is_start_1_admin,
          is_start_2_admin: item.is_start_2_admin,
          is_done_1_admin: item.is_done_1_admin,
          is_done_2_admin: item.is_done_2_admin,
          finish_date_manager: date5,
          start_date_manager: date6,
          comment: item.comment,
          pj_name: item.pj_name,
          block_name: item.block_name,
          hemjee: item.hemjee,
          hemjee_name: item.hemjee_name,
        }
        array.push(obj)
      })

      res.json(array)
    })
    .catch((error) => next(error))
})

router.get("/getAllTest", (req, res, next) => {
  let arr1 = []
  ProcessWorkViewTable.getAllTest()
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.pj_name)
        arr2.push(itemResult.block_name)
        arr2.push(itemResult.unit_name)
        arr2.push(itemResult.zagvar_name)
        arr2.push(itemResult.field_name)
        arr2.push(itemResult.work_name)
        arr2.push(itemResult.hemjee)
        arr2.push(itemResult.hemjee_name)
        arr2.push(itemResult.material_name)
        arr2.push(itemResult.material_code)
        //
        arr2.push(itemResult.is_start_1_admin)
        if (itemResult.start_date1_admin !== null) {
          arr2.push(moment(itemResult.start_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date1_admin)
        }
        arr2.push(itemResult.is_done_1_admin)
        if (itemResult.finish_date1_admin !== null) {
          arr2.push(moment(itemResult.finish_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date1_admin)
        }
        //
        arr2.push(itemResult.is_start_2_admin)
        if (itemResult.start_date2_admin !== null) {
          arr2.push(moment(itemResult.start_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date2_admin)
        }
        arr2.push(itemResult.is_done_2_admin)
        if (itemResult.finish_date2_admin !== null) {
          arr2.push(moment(itemResult.finish_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date2_admin)
        }
        if (itemResult.start_date_manager !== null) {
          arr2.push(moment(itemResult.start_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date_manager)
        }
        if (itemResult.finish_date_manager !== null) {
          arr2.push(moment(itemResult.finish_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date_manager)
        }
        arr2.push(itemResult.comment)
        arr2.push(itemResult.f_material_too)
        arr2.push(itemResult.l_material_too)
        if (itemResult.process_material_date !== null) {
          arr2.push(moment(itemResult.process_material_date).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.process_material_date)
        }
        arr2.push(itemResult.nyarav_name)
        arr2.push(itemResult.manager_name)
        arr2.push(itemResult.admin_name)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

//mobile
//---------------MOBILE TABLE------------//

router.post("/getProcessWorks", (req, res, next) => {
  const { unit_id, field_id } = req.body
  let arr1 = []
  ProcessWorkViewTable.getProcessWorks({ unit_id, field_id })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.work_name)
        arr2.push(itemResult.hemjee)
        arr2.push(itemResult.hemjee_name)
        arr2.push(itemResult.is_start_1_admin)
        if (itemResult.start_date1_admin !== null) {
          arr2.push(moment(itemResult.start_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date1_admin)
        }
        arr2.push(itemResult.is_start_2_admin)
        if (itemResult.start_date2_admin !== null) {
          arr2.push(moment(itemResult.start_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date2_admin)
        }
        arr2.push(itemResult.is_done_1_admin)
        if (itemResult.finish_date1_admin !== null) {
          arr2.push(moment(itemResult.finish_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date1_admin)
        }
        arr2.push(itemResult.is_done_2_admin)
        if (itemResult.finish_date2_admin !== null) {
          arr2.push(moment(itemResult.finish_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date2_admin)
        }
        if (itemResult.start_date_manager !== null) {
          arr2.push(moment(itemResult.start_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date_manager)
        }
        if (itemResult.finish_date_manager !== null) {
          arr2.push(moment(itemResult.finish_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date_manager)
        }
        arr2.push(itemResult.admin_name)
        arr2.push(itemResult.manager_name)
        arr2.push(itemResult.comment)
        arr2.push(itemResult.id)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

router.post("/getProcessWorksSearch", (req, res, next) => {
  const { unit_id, field_id, manager_id, is_done } = req.body
  let arr1 = []
  ProcessWorkViewTable.getProcessWorksSearch({
    unit_id,
    field_id,
    manager_id,
    is_done,
  })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.work_name)
        arr2.push(itemResult.hemjee)
        arr2.push(itemResult.hemjee_name)
        arr2.push(itemResult.is_start_1_admin)
        if (itemResult.start_date1_admin !== null) {
          arr2.push(moment(itemResult.start_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date1_admin)
        }
        arr2.push(itemResult.is_start_2_admin)
        if (itemResult.start_date2_admin !== null) {
          arr2.push(moment(itemResult.start_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date2_admin)
        }
        arr2.push(itemResult.is_done_1_admin)
        if (itemResult.finish_date1_admin !== null) {
          arr2.push(moment(itemResult.finish_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date1_admin)
        }
        arr2.push(itemResult.is_done_2_admin)
        if (itemResult.finish_date2_admin !== null) {
          arr2.push(moment(itemResult.finish_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date2_admin)
        }
        if (itemResult.start_date_manager !== null) {
          arr2.push(moment(itemResult.start_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date_manager)
        }
        if (itemResult.finish_date_manager !== null) {
          arr2.push(moment(itemResult.finish_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date_manager)
        }
        arr2.push(itemResult.admin_name)
        arr2.push(itemResult.manager_name)
        arr2.push(itemResult.comment)
        arr2.push(itemResult.id)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

router.post("/getProcessWorks1", (req, res, next) => {
  const { project_id, block_id, type } = req.body
  let arr1 = []
  ProcessWorkViewTable.getProcessWorks1({ project_id, block_id, type })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.work_name)
        arr2.push(itemResult.hemjee)
        arr2.push(itemResult.hemjee_name)
        arr2.push(itemResult.is_start_1_admin)
        if (itemResult.start_date1_admin !== null) {
          arr2.push(moment(itemResult.start_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date1_admin)
        }
        arr2.push(itemResult.is_start_2_admin)
        if (itemResult.start_date2_admin !== null) {
          arr2.push(moment(itemResult.start_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date2_admin)
        }
        arr2.push(itemResult.is_done_1_admin)
        if (itemResult.finish_date1_admin !== null) {
          arr2.push(moment(itemResult.finish_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date1_admin)
        }
        arr2.push(itemResult.is_done_2_admin)
        if (itemResult.finish_date2_admin !== null) {
          arr2.push(moment(itemResult.finish_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date2_admin)
        }
        if (itemResult.start_date_manager !== null) {
          arr2.push(moment(itemResult.start_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date_manager)
        }
        if (itemResult.finish_date_manager !== null) {
          arr2.push(moment(itemResult.finish_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date_manager)
        }
        arr2.push(itemResult.admin_name)
        arr2.push(itemResult.manager_name)
        arr2.push(itemResult.comment)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

router.post("/getProcessWorks2", (req, res, next) => {
  const { project_id, block_id, type, floor_id } = req.body
  let arr1 = []
  ProcessWorkViewTable.getProcessWorks2({
    project_id,
    block_id,
    type,
    floor_id,
  })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.work_name)
        arr2.push(itemResult.hemjee)
        arr2.push(itemResult.hemjee_name)
        arr2.push(itemResult.is_start_1_admin)
        if (itemResult.start_date1_admin !== null) {
          arr2.push(moment(itemResult.start_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date1_admin)
        }
        arr2.push(itemResult.is_start_2_admin)
        if (itemResult.start_date2_admin !== null) {
          arr2.push(moment(itemResult.start_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date2_admin)
        }
        arr2.push(itemResult.is_done_1_admin)
        if (itemResult.finish_date1_admin !== null) {
          arr2.push(moment(itemResult.finish_date1_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date1_admin)
        }
        arr2.push(itemResult.is_done_2_admin)
        if (itemResult.finish_date2_admin !== null) {
          arr2.push(moment(itemResult.finish_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date2_admin)
        }
        if (itemResult.start_date_manager !== null) {
          arr2.push(moment(itemResult.start_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.start_date_manager)
        }
        if (itemResult.finish_date_manager !== null) {
          arr2.push(moment(itemResult.finish_date_manager).format("MM/DD/YYYY"))
        } else {
          arr2.push(itemResult.finish_date_manager)
        }
        arr2.push(itemResult.admin_name)
        arr2.push(itemResult.manager_name)
        arr2.push(itemResult.comment)
        arr2.push(itemResult.id)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

router.post("/getProcessWorks3", (req, res, next) => {
  const { manager_id, unit_id } = req.body
  let arr1 = []
  ProcessWorkViewTable.getProcessWorks3({
    manager_id,
    unit_id,
  })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.work_name)
        arr2.push(itemResult.field_name)
        if (
          itemResult.start_date1_admin !== null &&
          itemResult.start_date2_admin === null
        ) {
          arr2.push(moment(itemResult.start_date1_admin).format("MM/DD/YYYY"))
        } else if (
          itemResult.start_date1_admin === null &&
          itemResult.start_date2_admin !== null
        ) {
          arr2.push(moment(itemResult.start_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(null)
        }
        arr2.push(itemResult.id)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

router.post("/getProcessWorks3Search", (req, res, next) => {
  const { manager_id, unit_id, trueA, trueB } = req.body
  let arr1 = []
  ProcessWorkViewTable.getProcessWorks3Search({
    manager_id,
    unit_id,
    trueA,
    trueB,
  })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.work_name)
        arr2.push(itemResult.field_name)
        if (
          itemResult.start_date1_admin !== null &&
          itemResult.start_date2_admin === null
        ) {
          arr2.push(moment(itemResult.start_date1_admin).format("MM/DD/YYYY"))
        } else if (
          itemResult.start_date1_admin === null &&
          itemResult.start_date2_admin !== null
        ) {
          arr2.push(moment(itemResult.start_date2_admin).format("MM/DD/YYYY"))
        } else {
          arr2.push(null)
        }
        arr2.push(itemResult.id)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

router.post("/getAllByPWid", (req, res, next) => {
  const { process_work_id } = req.body
  let array = []
  ProcessWorkViewTable.getAllByPWid({ process_work_id })
    .then((response) => {
      response.forEach((item) => {
        let object = {
          material_id: item.material_id,
          material_code: item.material_code,
          material_name: item.material_name,
          f_material_too: item.f_material_too,
          l_material_too: item.l_material_too,
        }
        array.push(object)
      })
      res.json(array)
    })
    .catch((error) => next(error))
})

//-------------ACTION BEGIN HERE-----------------//

router.post("/update1Admin", (req, res, next) => {
  const { process_id } = req.body
  ProcessWorkTable.update1Admin({ process_id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/update1Zahiral", (req, res, next) => {
  const { process_id } = req.body
  ProcessWorkTable.update1Zahiral({ process_id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/update2Manager", (req, res, next) => {
  const { start_date_manager, comment, finish_date_manager, process_id } = req.body
  ProcessWorkTable.update2Manager({
    start_date_manager,
    comment,
    finish_date_manager,
    process_id,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

// router.post("/update3Manager", (req, res, next) => {
//   const { comment, finish_date_manager, process_id } = req.body;
//   ProcessWorkTable.update3Manager({ comment, finish_date_manager, process_id })
//     .then(({ message }) => {
//       res.json({ message });
//     })
//     .catch((error) => next(error));
// });

router.post("/update4Admin", (req, res, next) => {
  const { process_id } = req.body
  ProcessWorkTable.update4Admin({ process_id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/update4Zahiral", (req, res, next) => {
  const { process_id } = req.body
  ProcessWorkTable.update4Zahiral({ process_id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/updateAdminSpecial", (req, res, next) => {
  const { process_id, is_start_1_admin, is_done_1_admin } = req.body
  ProcessWorkTable.updateAdminSpecial({
    process_id,
    is_start_1_admin,
    is_done_1_admin,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

module.exports = router
