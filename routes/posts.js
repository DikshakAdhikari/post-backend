const express = require("express");
const multer = require("multer");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const postModel = require("../models/postModel");
const tagModel = require("../models/tagsModel");
dotenv.config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const postRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

postRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    const userImage = req.file;
    const { title, description, tags } = req.body;
    console.log(tags);
    const tagsList= tags.split(" ")
    console.log(tagsList);
    const imageStream = fs.readFileSync(userImage.path);
    const fileName = generateFileName();
    const uploadParams = {
      Bucket: "blog.dikshak",
      Body: imageStream,
      Key: `uploads/profile-pic/${fileName}`,
      ContentType: userImage.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const saveDocument = await postModel.create({
      image: `https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/${fileName}`,
      title: title,
      description: description,
      tags:tagsList
    });
    await saveDocument.save();
    res.json("Document saved successfully!");
  } catch (err) {
    res.json(err);
  }
});

postRouter.get('/', async(req,res)=> {
    try{
        const {limit, page, sort, search}= req.query
        console.log(typeof(limit), page, sort, search);
        const limitInt = +limit || 5
        const sortOrder= sort || "desc"



    }catch(err){
        res.json(err)
    }
})

postRouter.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt', keyword, tag } = req.query;
        
        // Validate additional parameters
        const validParams = ['page', 'limit', 'sort', 'keyword', 'tag'];
        for (let param in req.query) {
            if (!validParams.includes(param)) {
                return res.status(400).json({ error: 'BAD_REQUEST' });
            }
        }

        // Create filters
        let filters = {};
        if (keyword) {
            filters.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }
        if (tag) {
            const tagDoc = await tagModel.findOne({ name: tag });
            if (tagDoc) {
                filters.tags = tagDoc._id;
            }
        }

        // Fetch posts
        const posts = await postModel.find(filters)
            .populate('tags')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Count total documents
        const total = await  postModel.countDocuments(filters);

        res.json({ total, posts, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = postRouter;
