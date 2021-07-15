const { Router } = require("express")
const router = new Router()
const BlockTable = require("../block/table")

//admin
router.post("/insert", (req, res, next) => {
  const { name } = req.body
  BlockTable.insert({ name })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  BlockTable.getAll()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

router.post("/update", (req, res, next) => {
  const { name, id } = req.body
  BlockTable.update({ name, id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/delete", (req, res, next) => {
  const { id } = req.body
  BlockTable.delete({ id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => {
      res.json({ error: error.code })
      next(error)
    })
})

//mobile
router.get("/getAllForPicker", (req, res, next) => {
  let blockData = []
  BlockTable.getAll()
    .then((result) => {
      result.forEach((element) => {
        let blockObj = { label: element.name, value: element.id }
        blockData.push(blockObj)
      })
      res.json({ blockData })
    })
    .catch((error) => next(error))
})

router.post("/getAllWithPj", (req, res, next) => {
  const { project_id } = req.body
  BlockTable.getAllWithPj({ project_id })
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

router.post("/getFloors", (req, res, next) => {
  const { zagvar_turul_id, block_id, project_id } = req.body
  BlockTable.getFloors({ zagvar_turul_id, block_id, project_id })
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

module.exports = router
