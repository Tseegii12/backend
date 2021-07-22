const userTable = require("../account/table")
const { APP_SECRET } = require("../secrets")
const jwt = require("jsonwebtoken")

const setToken = ({ user_name, password, res }) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ user_name, password }, APP_SECRET, {
      expiresIn: 3600,
    })
    res.json({
      expiresIn: 3600,
      token: token,
      message: "success",
    })
  })
}

const deleteToken = ({ res }) => res.json({ token: null })

const authenticatedAccount = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      const error = new Error("Invalid token")
      error.statusCode = 400
      return reject(error)
    } else {
      const { user_name, password } = jwt.decode(token, APP_SECRET)
      let authenticated = false
      userTable
        .getUserByName({ user_name })
        .then(({ users }) => {
          if (users && users.password == password) {
            authenticated = true
          }
          resolve({
            token: token,
            user_name: users.user_name,
            isAdmin: users.isAdmin,
            authenticated,
            type_id: users.type_id,
            users: users,
          })
        })
        .catch((error) => reject(error))
    }
  })
}

const getCurrentUser = (token) => {
  return new Promise((resolve, reject) => {
    if (token) {
      const { user_name } = jwt.decode(token, APP_SECRET)

      userTable.getUserByName({ user_name })
          .then((user) => {
            if (user) {
              resolve({
                user:{
                  id: user.users.id,
                  name: user.users.name
                }
              })
            } else {
              resolve({
                user: null
              })
            }
          })
          .catch((error) => reject(error))
    } else {
      const error = new Error("403 Forbidden")
      error.statusCode = 403
      return reject(error)
    }
  })
}

module.exports = { setToken, deleteToken, authenticatedAccount, getCurrentUser }
