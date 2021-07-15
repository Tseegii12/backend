const { Router } = require("express");

const UserTable = require("../account/table");

const { hash } = require("../account/helper");
const {
  setToken,
  deleteToken,
  authenticatedAccount,
} = require("./accountHelper");

const router = new Router();

router.post("/signup", (req, res, next) => {
  const { user_name, password, name, type_id, project_id } = req.body;
  const passwordHash = hash(password);

  UserTable.getUserByName({ user_name })
    .then(({ users }) => {
      if (!users) {
        return UserTable.storeUser({
          user_name,
          passwordHash,
          name,
          type_id,
          project_id,
        });
      } else {
        res.json({ message: "Бүртгэгдсэн хаяг байна!", error: 409 });
      }
    })
    .then(({ users }) => {
      let { user_name, password } = users;
      return setToken({ user_name, password, res });
    })
    .then(({ message }) => res.json({ message }))
    .catch((error) => next(error));
});

router.post("/login", (req, res, next) => {
  const { user_name, password } = req.body;
  UserTable.getUserByName({ user_name })
    .then(({ users }) => {
      if (users && users.password === hash(password)) {
        const { user_name, password } = users;

        return setToken({ user_name, password, res });
      } else {
        res.json({ message: "Нэвтрэх нэр, нууц үг буруу байна!", error: 409 });
      }
    })
    .catch((error) => next(error));
});

router.get("/logout", (req, res, next) => {
  deleteToken({ res });
});

router.get("/authenticated", (req, res, next) => {
  let patt = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  if (patt.test(req.headers.token)) {
    authenticatedAccount(req.headers.token)
      .then(({ authenticated, user_name, isAdmin, type_id }) =>
        res.json({ authenticated, user_name, isAdmin, type_id })
      )
      .catch((error) => next(error));
  } else {
    res.json(false);
  }
});

router.post("/profile", (req, res, next) => {
  const { token } = req.body;
  let patt = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  if (patt.test(token)) {
    authenticatedAccount(token)
      .then(({ users, authenticated }) => {
        if (authenticated) res.json({ users, token: token });
        else res.json({ message: "Баталгаажуулалт буруу байна", error: 409 });
      })
      .catch((error) => next(error));
  } else {
    res.json({ message: "Системд алдаа гарсан", error: 404 });
  }
});

router.post("/update", (req, res, next) => {
  const {
    token,
    user_name,
    name,
    password,
    type_id,
    project_id,
    id,
  } = req.body;
  let patt = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

  if (patt.test(token)) {
    authenticatedAccount(token)
      .then(({ authenticated }) => {
        if (authenticated) {
          if (password !== "") {
            console.log("1", password);
            let passwordHash = hash(password);
            console.log("2", passwordHash);
            UserTable.updatePass({
              user_name,
              name,
              passwordHash,
              type_id,
              project_id,
              id,
            })
              .then(({ message }) => {
                res.json({ message });
              })
              .catch((error) => next(error));
          } else {
            UserTable.update({
              user_name,
              name,
              type_id,
              project_id,
              id,
            })
              .then(({ message }) => {
                res.json({ message });
              })
              .catch((error) => next(error));
          }
        } else res.json({ message: "Баталгаажуулалт буруу байна", error: 409 });
      })
      .catch((error) => next(error));
  } else {
    res.json({ message: "Системд алдаа гарсан", error: 404 });
  }
});

router.post("/delete", (req, res, next) => {
  const { id, token } = req.body;
  let patt = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  if (patt.test(token)) {
    authenticatedAccount(token)
      .then(({ authenticated }) => {
        if (authenticated) {
          console.log("?");
          UserTable.delete({
            id,
          })
            .then(({ message }) => {
              res.json({ message });
            })
            .catch((error) => {
              res.json({ error: error.code });
              next(error);
            });
        } else res.json({ message: "Баталгаажуулалт буруу байна", error: 409 });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    res.json({ message: "Системд алдаа гарсан", error: 404 });
  }
});

module.exports = router;
