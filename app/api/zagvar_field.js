const { Router } = require("express")
const router = new Router()
const zagvarFieldTable = require("../zagvar_field/table")

//admin
router.post("/insert", (req, res, next) => {
  const { zagvar_id, field_id } = req.body
  zagvarFieldTable
    .insert({ zagvar_id, field_id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  zagvarFieldTable
    .getAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/update", (req, res, next) => {
  const { zagvar_id, field_id, id } = req.body
  zagvarFieldTable
    .update({ zagvar_id, field_id, id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/delete", (req, res, next) => {
  const { id } = req.body
  zagvarFieldTable
    .delete({ id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => {
      res.json({ error: error.code })
      next(error)
    })
})

//mobile
router.post("/getAllByZagvar", (req, res, next) => {
  const { zagvar_id } = req.body
  zagvarFieldTable
    .getAllByZagvar({ zagvar_id })
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/getCount", (req, res, next) => {
  const { zagvar_id } = req.body
  zagvarFieldTable
    .getCount({ zagvar_id })
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

module.exports = router
