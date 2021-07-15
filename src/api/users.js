const { Router } = require("express")
const router = new Router()
const usersTable = require("../users/table")

//admin
router.get("/getUsers", (req, res, next) => {
  usersTable
    .getUsers()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      next(error)
    })
})

router.get("/getUsersNotAdmin", (req, res, next) => {
  usersTable
    .getUsersForPicker()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

//mobile
router.get("/getManagers", (req, res, next) => {
  let userData = []
  usersTable
    .getManagers()
    .then((result) => {
      result.forEach((element) => {
        let userObj = {
          label: element.name,
          value: element.id,
          pj_id: element.project_id,
        }
        userData.push(userObj)
      })
      res.json({ userData })
    })
    .catch((error) => next(error))
})

router.get("/getUsersForPicker", (req, res, next) => {
  let userData = []
  usersTable
    .getUsersForPicker()
    .then((result) => {
      result.forEach((element) => {
        let userObj = {
          label: element.name + " / " + element.user_type_name,
          value: element.id,
        }
        userData.push(userObj)
      })
      res.json({ userData })
    })
    .catch((error) => next(error))
})

module.exports = router
