const express = require("express");
const { verifyJwt } = require("../middlewares/auth.middleware");
const { createPost } = require("../controllers/post.controllers");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router
  .route("/create-post")
  .post(verifyJwt, upload.array("files", 10), createPost);

module.exports = router;
