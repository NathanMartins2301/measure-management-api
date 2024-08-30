import dotenv from "dotenv"
dotenv.config()

import express from "express";
import cors from "cors"
import measureRoutes from './routes/measureRoutes'


const app = express()
const port = process.env.PORT || 80

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(measureRoutes)



app.listen(port, () => console.log('Server running')
)