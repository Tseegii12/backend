const { Router } = require("express")
const router = new Router()
const requestTable = require("../request/table")
const accountHelper = require("../api/accountHelper")

router.get("/list", (req, res, next) => {
  requestTable
    .index()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

router.get("/:requestId/users", (req, res, next) => {
  const { requestId } = req.params

  requestTable
    .getRequestUsers(requestId)
    .then(({ users }) => {
      res.json(users)
    })
    .catch((error) => next(error))
})

router.get("/current", (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1]

  accountHelper
    .getCurrentUser(token)
    .then((result) => {
      if (result.user) {
        let currentUser = result.user

        requestTable
          .getByUserId(currentUser.id)
          .then((result) => {
            res.json(result)
          })
          .catch((error) => next(error))
      } else {
        res.status(401).json({ message: "Not Authorized" })
      }
    })
    .catch((error) => next(error))
})

router.post("/reply", (req, res, next) => {
  const { content, request_id } = req.body
  let errors = []

  if (content === "" || content === null || content === undefined) {
    errors.push({ content: { message: "Агуулга оруулна уу" } })
  }
  if (
    request_id === "" ||
    request_id === null ||
    request_id === undefined ||
    request_id < 0
  ) {
    errors.push({ request_id: { message: "Хүсэлтийн ID оруулна уу" } })
  }

  if (errors.length === 0) {
    let token = req.headers["authorization"].split(" ")[1]
    accountHelper
      .getCurrentUser(token)
      .then((result) => {
        if (result.user) {
          let creator = result.user

          requestTable
            .insertUserRequest({ content, request_id, creator })
            .then((result) => {
              res.status(201).json(result)
            })
            .catch((error) => next(error))
        } else {
          res.status(401).json({ message: "Not Authorized" })
        }
      })
      .catch((error) => next(error))
  } else {
    res.status(400).json({ success: false, errors: errors })
  }
})

router.post("/create", (req, res, next) => {
  const { content, users } = req.body
  let errors = []

  if (users === [] || users === null || users === undefined) {
    errors.push({ users: { message: "Хэрэглэгч сонгоно уу" } })
  }
  if (content === "" || content === null || content === undefined) {
    errors.push({ content: { message: "Агуулга оруулна уу" } })
  }

  if (errors.length === 0) {
    let tokenHeader = req.headers["authorization"]

    if (tokenHeader) {
      let token = req.headers["authorization"].split(" ")[1]

      accountHelper
        .getCurrentUser(token)
        .then((result) => {
          if (result.user) {
            let creator = result.user

            requestTable
              .insert({ content, creator })
              .then(({ r }) => {
                requestTable
                  .getLastRequest()
                  .then((result) => {
                    if (result.length > 0) {
                      let requestId = result[0].id
                      let data = []

                      users.map((userId) => {
                        let innerData = []

                        innerData.push(requestId)
                        innerData.push(userId)
                        data.push(innerData)
                      })

                      requestTable
                        .insertUser({ data })
                        .then(({ result }) => {
                          if (result.success) {
                            res.status(201).json(result)
                          } else {
                            res.status(400).json(result)
                          }
                        })
                        .catch((error) => next(error))
                    }
                  })
                  .catch((error) => next(error))
              })
              .catch((error) => next(error))
          } else {
            res.status(401).json({ message: "Not Authorized" })
          }
        })
        .catch((error) => next(error))
    } else {
      res.status(403).json({ success: false, message: "403 Forbidden" })
    }
  } else {
    res.status(400).json({ success: false, errors: errors })
  }
})

router.put("/update", (req, res, next) => {
  const { id, content, users } = req.body
  let errors = []

  if (id === undefined || id === -1) {
    errors.push({ id: { message: "Хүсэлтийн ID шаардлагатай" } })
  }
  if (users === [] || users === null || users === undefined) {
    errors.push({ users: { message: "Хэрэглэгч сонгоно уу" } })
  }
  if (content === "" || content === null || content === undefined) {
    errors.push({ content: { message: "Агуулга оруулна уу" } })
  }

  let users_data = []
  if (users !== undefined) {
    users.map((userId) => {
      let innerData = []

      innerData.push(id)
      innerData.push(userId)
      users_data.push(innerData)
    })
  }

  if (errors.length === 0) {
    let tokenHeader = req.headers["authorization"]

    if (tokenHeader) {
      let token = req.headers["authorization"].split(" ")[1]
      accountHelper
        .getCurrentUser(token)
        .then((result) => {
          if (result.user) {
            let creator = result.user

            if (errors.length === 0) {
              requestTable
                .update({ id, content, creator, users_data })
                .then(({ result }) => {
                  if (result.success) {
                    res.status(202).json(result)
                  } else {
                    res.status(400).json({ success: false, result: result })
                  }
                })
            } else {
              res.status(400).json({ success: false, errors: errors })
            }
          } else {
            res.status(401).json({ message: "Not Authorized" })
          }
        })
        .catch((error) => next(error))
    } else {
      res.status(403).json({ success: false, message: "403 Forbidden" })
    }
  } else {
    res.status(400).json({ success: false, errors: errors })
  }
})

router.delete("/delete/:id", (req, res, next) => {
  const { id } = req.params

  if (id === undefined || id === -1) {
    return res.status(400).json({ success: false, message: "Хүсэлтийн ID шаардлагатай" })
  }

  requestTable
    .delete({ id })
    .then(({ result }) => {
      if (result.success) {
        res.status(204).json(null)
      } else {
        res.status(400).json(result)
      }
    })
    .catch((error) => next(error))
})

router.delete("/delete/:id/reply", (req, res, next) => {
  const { id } = req.params

  if (id === undefined || id === -1) {
    return res.status(400).json({ success: false, message: "ID шаардлагатай" })
  }

  requestTable
    .deleteReply(id)
    .then(({ result }) => {
      if (result.success) {
        res.status(204).json(null)
      } else {
        res.status(400).json(result)
      }
    })
    .catch((error) => next(error))
})

module.exports = router
