const postModel = require("../models/postModel");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const tagModel = require("../models/tagsModel");
dotenv.config()

const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

const addPost= async(req,res)=> {
    try {
        const userImage = req.file;
        const { title, description, tags } = req.body;
        const tagsList= tags.split(",")
        let arr = []

        await Promise.all(tagsList.map(async(val)=> {
            console.log(val);
            const tag= await tagModel.findOne({name:val})
            arr.push(tag._id)
        }))
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
          tags:arr
        });
        await saveDocument.save();
        res.json("Document saved successfully!");
      } catch (err) {
        res.json(err);
      }
}

const allPosts= async(req,res)=> {
    try{
        const posts = await postModel.find()
        res.json(posts)
    }catch(err){
        res.json(err)
    }
}


const filteredPost= async (req,res)=> {
    try {
        const { page = 1, limit = 10, sort, keyword, tag } = req.query;
    
        const validParams = ['page', 'limit', 'sort', 'keyword', 'tag'];
        
        for (const param in req.query) {
          if (!validParams.includes(param)) {
            return res.status(400).send('BAD_REQUEST');
          }
        }
    
        const filter = {};
    
        if (keyword) {
          filter.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
          ];
        }
    
        if (tag) {
          const tagDoc = await tagModel.findOne({ name: tag });
          if (tagDoc) {
            filter.tags = tagDoc._id;
          } else {
            return res.json([]);
          }
        }
    
        const posts = await  postModel.find(filter)
          .sort(sort ? { [sort]: 1 } : {})
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .populate('tags');
    
        res.json(posts);
      } catch (err) {
        res.status(500).send(err.message);
      }
}

module.exports= {
    addPost, allPosts, filteredPost
}