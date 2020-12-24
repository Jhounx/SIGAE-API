import express from "express"
import routes from "./src/routes"
import cors from 'cors'
import morgan from 'morgan'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))

app.use("/api", routes)

app.listen(80, ()=> {
   console.log("Servidor iniciado!")
})