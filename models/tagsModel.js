const mongoose= require('mongoose')

const tagsSchema= mongoose.Schema({
    tags:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true
    }
})

const tagsModel= mongoose.model('tags', tagsSchema)

module.exports= tagsModel