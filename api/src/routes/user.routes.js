const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const { userRegistration, userLogin, userLogout } = require( "../controllers/user.controller" );
const { verifyJwt } = require( "../middlewares/auth.middleware" );

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegistration
);

router.route( "/login" ).post( userLogin );
router.route( "/logout" ).post( verifyJwt, userLogout );

module.exports = router;
