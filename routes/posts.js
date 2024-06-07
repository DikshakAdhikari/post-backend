const express= require('express')

const postRouter= express.Router()

postRouter.post('/', async(req,res)=> {
    try{
        const data= req.body
    }catch(err){
        res.json(err)
    }
})

module.exports= postRouter