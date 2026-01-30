import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()


app.use(cors({
    origin : "*",
    credentials : true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/User.js"

import workflowRoute from "./routes/workflow.r.js"

import executionRoute from "./routes/execution.r.js"

app.use("/api/v1/users", userRouter)

app.use("/api/v1/workflow", workflowRoute)

app.use("/api/v1/execution", executionRoute)


export {app}  