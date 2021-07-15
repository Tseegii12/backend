const { Router } = require("express")
var moment = require("moment") // require
const router = new Router()
const AguulahTable = require("../aguulah/table")

//admin, nyarav
router.post("/insert", (req, res, next) => {
  const {
    material_id,
    material_too,
    material_une,
    date,
    project_id,
    nyarav_id,
    buy_place_id,
    padan_dugaar,
  } = req.body
  AguulahTable.insert({
    material_id,
    material_too,
    material_une,
    date,
    project_id,
    nyarav_id,
    buy_place_id,
    padan_dugaar,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.get("/getAll", (req, res, next) => {
  AguulahTable.getAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.get("/getAllFalse", (req, res, next) => {
  AguulahTable.getAllFalse()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.get("/getAllByPadan", (req, res, next) => {
  AguulahTable.getAllByPadan()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/getAllByPadanWithUser", (req, res, next) => {
  const { nyarav_id } = req.body
  AguulahTable.getAllByPadanWithUser({ nyarav_id })
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/getAllByPadanWithParam", (req, res, next) => {
  const { padan_dugaar, nyarav_id } = req.body
  AguulahTable.getAllByPadanWithParam({ padan_dugaar, nyarav_id })
    .then((response) => {
      let data = []
      response.forEach((item, index) => {
        let obj = {}
        obj.id = item.id
        obj.material_id = item.material_id
        obj.place_id = item.buy_place_id
        obj.place_name = item.gazar_name
        obj.material_name = item.material_name
        obj.too = item.material_too
        obj.une = item.material_une
        obj.totalPrice = `=(C${index + 1}*D${index + 1})`
        data.push(obj)
      })
      data.push({})
      data.push({})
      res.json(data)
    })
    .catch((error) => next(error))
})

router.post("/update", (req, res, next) => {
  const { id } = req.body
  AguulahTable.update({ id })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/updateByNyarav", (req, res, next) => {
  const { id, material_too, material_une, date, padan_dugaar } = req.body
  AguulahTable.updateByNyarav({
    id,
    material_too,
    material_une,
    date,
    padan_dugaar,
  })
    .then(({ message }) => {
      res.json({ message })
    })
    .catch((error) => next(error))
})

router.post("/getUldegdelByPjMaterial", (req, res, next) => {
  const { project_id, material_id } = req.body
  AguulahTable.getUldegdelByPjMaterial({ project_id, material_id })
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.post("/getUldegdelByPj", (req, res, next) => {
  const { project_id } = req.body
  AguulahTable.getUldegdelByPj({ project_id })
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

router.get("/getUldegdelAll", (req, res, next) => {
  AguulahTable.getUldegdelAll()
    .then((response) => {
      res.json(response)
    })
    .catch((error) => next(error))
})

//mobile
router.post("/getAllByPj", (req, res, next) => {
  const { project_id } = req.body
  let arr1 = []
  AguulahTable.getAllByPj({ project_id })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        arr2.push(itemResult.pj_name)
        arr2.push(itemResult.gazar_name)
        arr2.push(moment(itemResult.date).format("MM/DD/YYYY"))
        arr2.push(itemResult.material_name)
        arr2.push(itemResult.material_too)
        arr2.push(itemResult.material_une)
        arr2.push(itemResult.nyarav_une)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

router.post("/getUldegdelByPjMobile", (req, res, next) => {
  const { project_id } = req.body
  let arr1 = []
  AguulahTable.getUldegdelByPj({ project_id })
    .then((result) => {
      result.forEach((itemResult) => {
        let arr2 = []
        let A = itemResult.ashiglasan_niit
        if (itemResult.ashiglasan_niit === null) {
          itemResult.ashiglasan_niit = 0
        }
        let B = itemResult.aguulah_niit - A
        arr2.push(itemResult.name)
        arr2.push(itemResult.code)
        arr2.push(itemResult.aguulah_niit)
        arr2.push(A)
        arr2.push(B)
        arr1.push(arr2)
      })
      res.json(arr1)
    })
    .catch((error) => next(error))
})

module.exports = router
