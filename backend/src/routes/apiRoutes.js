const express = require("express");
const router = express.Router();

const { connectDB } = require("../db/connection");
const spMap = require("../config/spMap");

router.post("/", async (req, res) => {

    try {

        const { Action, ...params } = req.body;

        const procedure = spMap[Action];

        if (!procedure) {

            return res.status(400).json({
                success: false,
                message: "Invalid Action"
            });

        }

        const pool = await connectDB();

        const request = pool.request();

        // Add all parameters automatically
        Object.entries(params).forEach(([key, value]) => {
            request.input(key, value);
        });

        const result = await request.execute(procedure);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

module.exports = router;