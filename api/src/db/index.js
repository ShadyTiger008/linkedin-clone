const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        writeConcern: { w: "majority" },
      }
    );
    console.log(
      "\n MongoDB connected successfully! \n DB HOST: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MONGODB connection unsuccessful!", error);
    process.exit(1);
  }
};

module.exports = { connectDb };
