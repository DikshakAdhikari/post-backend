const express= require('express')
const dotenv= require('dotenv')
dotenv.config()
const connectDB = require('./connection/connect')
const postRouter = require('./routes/posts')
const app= express()
const port= process.env.PORT || 5000

app.use('/posts', postRouter)
connectDB()
app.use(express.json())

app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
})
