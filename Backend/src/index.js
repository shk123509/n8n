import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

import connectDB from "./db/index.js"
import { app } from './app.js'
// const port = 3000;


connectDB()
    .then(() => {

        app.listen(process.env.PORT || 4000, () => {
            console.log(`🚀 Server ready at →  http://localhost:${process.env.PORT || 4000}`);

        })
    }).catch((err) => {
        console.log("MONGO db connection faild", err);

    })
