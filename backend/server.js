require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/db/connection");

const PORT = process.env.PORT || 5000;
const HOST = "127.0.0.1";

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
});