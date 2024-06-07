const express = require("express");
const multer = require("multer");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const postModel = require("../models/postModel");
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
    const { title, description } = req.body;
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
    });
    await saveDocument.save();
    res.json("Document saved successfully!");
  } catch (err) {
    res.json(err);
  }
});

module.exports = postRouter;
