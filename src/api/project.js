const { Router } = require("express")
const router = new Router()
const projectTable = require("../project/table")

//admin
router.post("/insert", (req, res, next) => {
  const { name } = req.body
  projectTable
    .insert({ name })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/update", (req, res, next) => {
  const { name, id } = req.body
  projectTable
    .update({ name, id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  projectTable
    .getAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/delete", (req, res, next) => {
  const { id } = req.body
  projectTable
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

module.exports = router
