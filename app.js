if (process.env.NODE_ENV == "development") {
  require("dotenv").config()
}
const express = require("express")
const app = express()
const routes = require("./routes")
const PORT = process.env.PORT || 3000
const errorHandler = require("./middlewares/errorHandler")
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/", routes)
app.use(errorHandler)
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT} 📡`))
