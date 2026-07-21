const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const apiRoutes = require("./routes/apiRoutes");

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Scheme360 API",
  });
});

app.use("/api", apiRoutes);

module.exports = app;
