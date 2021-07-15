const sql = require("mssql")
const { Router } = require("express")
const router = new Router()
const MssqlTable = require("../mssql_table/table")
const IrtsTable = require("../irts/table")

const sqlConfig = {
  user: "sa",
  password: "billbbr",
  database: "Att3000",
  server: "112.72.6.50",
  //   pool: {
  //     max: 10,
  //     min: 0,
  //     idleTimeoutMillis: 30000,
  //   },
  options: {
    encrypt: false, // for azure
    // trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
}

router.get("/getUserInfo", (req, res, next) => {
  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`SELECT TOP(5) * FROM userinfo ORDER BY name DESC`
    })
    .then((result) => {
      res.json(result)
      console.log("1", result)
    })
    .catch((err) => {
      console.log("2", err)
      // ... error checks
    })

  sql.on("error", (err) => {
    console.log("3", err)
    // ... error handler
  })
})

router.get("/checkinout", (req, res, next) => {
  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`SELECT TOP(50) * FROM checkinout ORDER BY checktime DESC`
    })
    .then((result) => {
      res.json(result)
      console.log("1", result)
    })
    .catch((err) => {
      console.log("2", err)
      // ... error checks
    })

  sql.on("error", (err) => {
    console.log("3", err)
    // ... error handler
  })
})

router.get("/query", (req, res, next) => {
  sql
    .connect(sqlConfig)
    .then(() => {
      return sql.query`SELECT checkinout.userid, checkinout.checktime, userinfo.name FROM checkinout
      LEFT JOIN userinfo ON checkinout.userid = userinfo.userid ORDER BY checkinout.checktime DESC`
    })
    .then((result) => {
      // res.json(result);
      let dataCopy = [...result.recordset]
      // console.log(dataCopy);
      MssqlTable.delete()
        .then(({ message }) => {
          if (message === "success") {
            MssqlTable.insert({ dataCopy })
              .then(({ message }) => {
                IrtsTable.updateIrts()
                  .then(({ message }) => {
                    res.json({ message })
                  })
                  .catch((err) => console.log("err", err))
              })
              .catch((err) => console.log("err", err))
          }
        })
        .catch((err) => console.log("err", err))
    })
    .catch((err) => {
      console.log("2", err)
      // ... error checks
    })

  sql.on("error", (err) => {
    console.log("3", err)
    // ... error handler
  })
})

module.exports = router
