const dotenv = require("dotenv");
const { connectDb } = require("./db/index.js");
const { app } = require("./app.js");

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    console.log(`⚙️  Server is listening on ${process.env.PORT}...`);
  })
  .catch(() => {
    console.error("💥 Error connecting to the database.");
  });
