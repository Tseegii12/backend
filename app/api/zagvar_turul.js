const { Router } = require("express")
const router = new Router()
const zagvarTurulTable = require("../zagvar_turul/table")

//admin
router.post("/insert", (req, res, next) => {
  const { name } = req.body
  zagvarTurulTable
    .insert({ name })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  zagvarTurulTable
    .getAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

module.exports = router
