const dotenv = require("dotenv");
const { connectDb } = require("./db/index.js");
const { app } = require("./app.js");

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`⚙️  Server listening on ${process.env.PORT}.....`);
    });
  })
  .catch((error) => {
    console.log(`Error listening on ${process.env.PORT}`, error);
  });