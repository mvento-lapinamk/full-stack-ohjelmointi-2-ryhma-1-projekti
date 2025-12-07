import express, { json, Router } from "express"
import {configDotenv} from "dotenv"
import "dotenv/config";
import cors from "cors"
import {specs, ui} from "./Swagger/swagger.js"
import users from "./Routes/Users.js"
import articles from "./Routes/Articles.js"
import comments from "./Routes/Comments.js"
import cookieParser from "cookie-parser"

configDotenv()

const app = express()

// Swagger otettu käyttöön
app.use('/swagger', ui.serve, ui.setup(specs))

app.use(json())
app.use(cors())
app.use(cookieParser())

// Reititykset
app.use("/users", users)
app.use("/articles", articles)
app.use("/comments", comments)

// Backendin käynnistyksen konsoliviestit
const launchMessage = "Backend käynnistetty: http://localhost:" + process.env.BACKEND_PORT
const docMessage = "Katso API dokumentaatio: http://localhost:" + process.env.BACKEND_PORT + "/swagger"

// Backendin käynnistys .env filessä määritettyyn porttiin
app.listen(process.env.BACKEND_PORT, () => {
    console.log(launchMessage)
    console.log(docMessage)
})