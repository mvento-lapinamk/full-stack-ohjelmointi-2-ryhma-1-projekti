

import express, { json, Router } from "express"
import {configDotenv} from "dotenv"
import 'dotenv/config';
import cors from "cors"
import user from "./Routes/User.js"
import articles from "./Routes/Articles.js"
import cookieParser from "cookie-parser"

configDotenv()

const app = express()
const PORT = 3000

app.use(json())
app.use(cors())
app.use(cookieParser())


app.use("/user", user)
app.use("/articles", articles)

app.listen(PORT, () => {
    console.log("Backend started at localhost port:", PORT)
})