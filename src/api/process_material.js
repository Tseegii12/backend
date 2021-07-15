const { Router } = require("express")
const router = new Router()
var moment = require("moment") // require
const ProcessMaterialTable = require("../process_material/table")

router.post("/insert", (req, res, next) => {
  const { process_work_id, material_id, material_too } = req.body
  ProcessMaterialTable.insert({
    process_work_id,
    material_id,
    material_too,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  ProcessMaterialTable.getAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/update", (req, res, next) => {
  const { id } = req.body
  ProcessMaterialTable.update({ id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/getAllById", (req, res, next) => {
  const { process_work_id } = req.body
  ProcessMaterialTable.getAllById({ process_work_id })
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

module.exports = router
