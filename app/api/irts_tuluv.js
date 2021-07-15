const { Router } = require("express")
const router = new Router()
const IrtsTuluvTable = require("../irts_tuluv/table")

//admin
router.post("/insert", (req, res, next) => {
  const { name } = req.body
  IrtsTuluvTable.insert({
    name,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  IrtsTuluvTable.getAll()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

module.exports = router
