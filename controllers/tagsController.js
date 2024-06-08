const tagModel = require("../models/tagsModel");

const addTag= async(req,res)=> {
    try {
        const tag = new tagModel({
            name: req.body.name
        });
        const savedTag = await tag.save();
        res.json(savedTag);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getTags= async(req,res)=> {
    try {
        const tags = await tagModel.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports= {
    addTag, getTags
}