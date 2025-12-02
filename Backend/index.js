

import express, { json, Router } from "express"
import {configDotenv} from "dotenv"
import cors from "cors"
import user from "./Routes/User.js"
import articles from "./Routes/Articles.js"

configDotenv()

const app = express()
//const PORT = 3000

app.use(json())
app.use(cors())


app.use("/user", user)
app.use("/article", articles)

app.listen(process.env.PORT, () => {
    console.log("Backend started!")
})