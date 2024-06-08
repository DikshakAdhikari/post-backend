const express= require('express');
const tagModel = require('../models/tagsModel');

const tagRouter= express.Router()

tagRouter.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const tag = new tagModel({
            name: req.body.name
        });
        const savedTag = await tag.save();
        res.json(savedTag);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


tagRouter.get('/', async (req, res) => {
    try {
        const tags = await tagModel.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports=tagRouter