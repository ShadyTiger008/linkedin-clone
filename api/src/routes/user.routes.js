const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const { userRegistration, userLogin, userLogout, verifyEmail, getUserById, connectedUser, sendConnection, getConnectionRequest, acceptConnection, getConnections } = require( "../controllers/user.controller" );
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

//End point to verify email
router.route("/verify/:token").get(verifyEmail);

router.route( "/login" ).post( userLogin );
router.route( "/logout" ).get( verifyJwt, userLogout );

router.route( "/getUser/:userId" ).get( getUserById );

router.route("/otherUsers").get(verifyJwt, connectedUser);

router.route( "/sendConnection" ).post( verifyJwt, sendConnection );

router.route( "/connection-requests" ).get( verifyJwt, getConnectionRequest );

router.route( "/connection-requests/accept" ).post( verifyJwt, acceptConnection );

router.route("/get-connections").get(verifyJwt, getConnections);

module.exports = router;
