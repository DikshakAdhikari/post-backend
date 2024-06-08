const express= require('express')
const dotenv= require('dotenv')
dotenv.config()
const connectDB = require('./connection/connect')
const postRouter = require('./routes/posts')
const tagRouter = require('./routes/tags')
const app= express()
const port= process.env.PORT || 5000
connectDB()
app.use(express.json())
app.use('/posts', postRouter)
app.use('/tags',tagRouter )



app.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
})
