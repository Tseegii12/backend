require("dotenv").config()

const app = require("../src")
const port = 3050

app.listen(port, "0.0.0.0", () => console.log(`listening on port ${port}`))
