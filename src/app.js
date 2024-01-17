import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import useRouter from "./routes/user.routes.js"

// routes declaration
//ith je kahi hotay te prefix hotay
//api tayar karata ahe ith
app.use("/api/v1/users",useRouter)

// he route create karat ahe mi 
// http://localhost:8000/api/v1/user/register


app.on("error",(error)=>{
    console.log("ERR: ",error);
    throw error
   })

export {app}