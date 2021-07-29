const express = require("express")
require("express-group-routes")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const bodyParser = require("body-parser")

//all routers from api
const accountRouter = require("./api/account")
const userTypeRouter = require("./api/user_type")
const processWorkRouter = require("./api/process_work")
const workRouter = require("./api/work")
const blockRouter = require("./api/block")
const fieldRouter = require("./api/field")
const materialRouter = require("./api/material")
const aguulahRouter = require("./api/aguulah")
const fieldWorkRouter = require("./api/field_work")
const tailanRouter = require("./api/tailan")
const usersRouter = require("./api/users")
const projectRouter = require("./api/project")
const processMaterialRouter = require("./api/process_material")
const zagvarRouter = require("./api/zagvar")
const floorRouter = require("./api/floor")
const processImgRouter = require("./api/process_img")
const fieldMaterialRouter = require("./api/field_material")
const workAttendanceRouter = require("./api/work_attendance")
const workTypeRouter = require("./api/work_type")
const aguulahPlaceRouter = require("./api/aguulah_place")
const materialTypeRouter = require("./api/material_type")
const unitRouter = require("./api/unit")
const buyPlaceRouter = require("./api/buyPlace")
const hemjeeRouter = require("./api/hemjee")
const zagvarTurulRouter = require("./api/zagvar_turul")
const zagvarFieldRouter = require("./api/zagvar_field")
const nyagtlanMaterialRouter = require("./api/nyagtlan_material")
const irtsRouter = require("./api/irts")
const workerRouter = require("./api/worker")
const irtsTuluvRouter = require("./api/irts_tuluv")
const queryIrtsRouter = require("./api/queryIrts")
const mssqlRouter = require("./api/mssql")

const requestRouter = require("./api/request")
const materialOrderRouter = require("./api/material_order")

const routeMiddleware = require("./middlewares/route-middleware")

const app = express()

console.log("PATH: ", path.join(__dirname, "../../"))
app.use(express.static(path.join(__dirname, "../../assets")))

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}))
app.use(cookieParser())

//routes
app.use("/account", accountRouter)
app.use("/mssql", mssqlRouter)
app.group("/", (router) => {
    router.use(routeMiddleware.checkToken)
    router.use("/userType", userTypeRouter)
    router.use("/processWork", processWorkRouter)
    router.use("/work", workRouter)
    router.use("/block", blockRouter)
    router.use("/field", fieldRouter)
    router.use("/material", materialRouter)
    router.use("/aguulah", aguulahRouter)
    router.use("/fieldWork", fieldWorkRouter)
    router.use("/tailan", tailanRouter)
    router.use("/users", usersRouter)
    router.use("/project", projectRouter)
    router.use("/processMaterial", processMaterialRouter)
    router.use("/zagvar", zagvarRouter)
    router.use("/floor", floorRouter)
    router.use("/processImg", processImgRouter)
    router.use("/fieldMaterial", fieldMaterialRouter)
    router.use("/workAttendance", workAttendanceRouter)
    router.use("/workType", workTypeRouter)
    router.use("/aguulahPlace", aguulahPlaceRouter)
    router.use("/materialType", materialTypeRouter)
    router.use("/unit", unitRouter)
    router.use("/hemjee", hemjeeRouter)
    router.use("/zagvarTurul", zagvarTurulRouter)
    router.use("/zagvarField", zagvarFieldRouter)
    router.use("/nyagtlanMaterial", nyagtlanMaterialRouter)
    router.use("/buyPlace", buyPlaceRouter)
    router.use("/worker", workerRouter)
    router.use("/irts", irtsRouter)
    router.use("/irtsTuluv", irtsTuluvRouter)
    router.use("/queryIrts", queryIrtsRouter)

    router.use("/request", requestRouter)
    router.use("/material_order", materialOrderRouter)
})

app.get("*", function (req, res) {
    res.status(404).json({success: false, message: "404 route not found"})
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500

    console.error("logging error", err)

    res.status(statusCode).json({
        type: "error",
        message: err.message,
    })
})

module.exports = app
