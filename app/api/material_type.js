const { Router } = require("express")
var moment = require("moment") // require
const router = new Router()
const MatieralTypeTable = require("../material_type/table")

router.post("/insert", (req, res, next) => {
  const { name } = req.body
  MatieralTypeTable.insert({
    name,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  MatieralTypeTable.getAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/update", (req, res, next) => {
  const { name, id } = req.body
  MatieralTypeTable.update({
    name,
    id,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/delete", (req, res, next) => {
  const { id } = req.body
  MatieralTypeTable.delete({ id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => {
      res.json({ error: error.code })
      next(error)
    })
})

module.exports = router
