const { Router } = require("express")
const router = new Router()
var moment = require("moment") // require
const FieldMaterialTable = require("../field_material/table")

router.post("/insert", (req, res, next) => {
  const { material_id, work_id, material_too, field_id, zagvar_id } = req.body
  FieldMaterialTable.insert({
    material_id,
    work_id,
    material_too,
    field_id,
    zagvar_id,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  FieldMaterialTable.getAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/update", (req, res, next) => {
  const { material_id, work_id, material_too, field_id, zagvar_id, id } = req.body
  FieldMaterialTable.update({
    material_id,
    work_id,
    material_too,
    field_id,
    zagvar_id,
    id,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/delete", (req, res, next) => {
  const { id } = req.body
  FieldMaterialTable.delete({ id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => {
      res.json({ error: error.code })
      next(error)
    })
})

module.exports = router
