const { asyncHandler } = require("../utils/asyncHandler");

const createPost = asyncHandler(async (req, res) => {
  const { description, imageUrl } = req.body;
  const userId = req.user?._id;
});

module.exports = { createPost };