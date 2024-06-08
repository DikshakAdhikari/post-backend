const mongoose= require('mongoose')

const postSchema= mongoose.Schema({
    image: {
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, {timestamps:true})

const postModel= new mongoose.model('post', postSchema)
module.exports= postModel