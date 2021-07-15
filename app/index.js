const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");

//all routers from api
const accountRouter = require("./api/account");
const userTypeRouter = require("./api/user_type");
const processWorkRouter = require("./api/process_work");
const workRouter = require("./api/work");
const blockRouter = require("./api/block");
const fieldRouter = require("./api/field");
const materialRouter = require("./api/material");
const aguulahRouter = require("./api/aguulah");
const fieldWorkRouter = require("./api/field_work");
const tailanRouter = require("./api/tailan");
const usersRouter = require("./api/users");
const projectRouter = require("./api/project");
const processMaterialRouter = require("./api/process_material");
const zagvarRouter = require("./api/zagvar");
const floorRouter = require("./api/floor");
const processImgRouter = require("./api/process_img");
const fieldMaterialRouter = require("./api/field_material");
const workAttendanceRouter = require("./api/work_attendance");
const workTypeRouter = require("./api/work_type");
const aguulahPlaceRouter = require("./api/aguulah_place");
const materialTypeRouter = require("./api/material_type");
const unitRouter = require("./api/unit");
const buyPlaceRouter = require("./api/buyPlace");
const hemjeeRouter = require("./api/hemjee");
const zagvarTurulRouter = require("./api/zagvar_turul");
const zagvarFieldRouter = require("./api/zagvar_field");
const nyagtlanMaterialRouter = require("./api/nyagtlan_material");
const irtsRouter = require("./api/irts");
const workerRouter = require("./api/worker");
const irtsTuluvRouter = require("./api/irts_tuluv");
const queryIrtsRouter = require("./api/queryIrts");
const mssqlRouter = require("./api/mssql");

const app = express();

console.log("PATH: ", path.join(__dirname, "../../"));
app.use(express.static(path.join(__dirname, "../../assets")));

app.use(
  cors({
    origin: ["http://103.119.92.48", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//routes
app.use("/account", accountRouter);
app.use("/userType", userTypeRouter);
app.use("/processWork", processWorkRouter);
app.use("/work", workRouter);
app.use("/block", blockRouter);
app.use("/field", fieldRouter);
app.use("/material", materialRouter);
app.use("/aguulah", aguulahRouter);
app.use("/fieldWork", fieldWorkRouter);
app.use("/tailan", tailanRouter);
app.use("/users", usersRouter);
app.use("/project", projectRouter);
app.use("/processMaterial", processMaterialRouter);
app.use("/zagvar", zagvarRouter);
app.use("/floor", floorRouter);
app.use("/processImg", processImgRouter);
app.use("/fieldMaterial", fieldMaterialRouter);
app.use("/workAttendance", workAttendanceRouter);
app.use("/workType", workTypeRouter);
app.use("/aguulahPlace", aguulahPlaceRouter);
app.use("/materialType", materialTypeRouter);
app.use("/unit", unitRouter);
app.use("/hemjee", hemjeeRouter);
app.use("/zagvarTurul", zagvarTurulRouter);
app.use("/zagvarField", zagvarFieldRouter);
app.use("/nyagtlanMaterial", nyagtlanMaterialRouter);
app.use("/buyPlace", buyPlaceRouter);
app.use("/worker", workerRouter);
app.use("/irts", irtsRouter);
app.use("/irtsTuluv", irtsTuluvRouter);
app.use("/queryIrts", queryIrtsRouter);
app.use("/mssql", mssqlRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error("logging error", err);

  res.status(statusCode).json({
    type: "error",
    message: err.message,
  });
});

module.exports = app;
