const express= require('express');
const {  addTag, getTags } = require('../controllers/tagsController');

const tagRouter= express.Router()

tagRouter.post('/', addTag  );


tagRouter.get('/', getTags);



module.exports=tagRouter