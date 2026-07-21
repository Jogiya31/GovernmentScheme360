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
        success: true,
        message: "Scheme360 API Running"
    });
});

app.use("/api", apiRoutes);

module.exports = app;