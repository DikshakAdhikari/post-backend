const express = require("express");
const multer = require("multer");
const path = require("path");
const { addPost, allPosts, filteredPost } = require("../controllers/postController");
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

postRouter.post("/", upload.single("file"), addPost);

postRouter.get('/all', allPosts)

postRouter.get('/', filteredPost);

module.exports = postRouter;
