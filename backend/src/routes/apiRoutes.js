const express = require("express");
const sql = require("mssql");

const router = express.Router();

const { connectDB } = require("../db/connection");
const spMap = require("../config/spMap");

router.post("/", async (req, res) => {
    try {

        const { Action, ...params } = req.body;

        if (!Action) {
            return res.status(400).json({
                success: false,
                message: "Action is required."
            });
        }

        const procedure = spMap[Action];

        if (!procedure) {
            return res.status(404).json({
                success: false,
                message: `No stored procedure found for '${Action}'.`
            });
        }

        const pool = await connectDB();

        const request = pool.request();

        // Add parameters automatically
        for (const [key, value] of Object.entries(params)) {

            if (value === undefined || value === null) continue;

            request.input(key, value);

            // If you want explicit SQL types:
            // request.input(key, sql.VarChar, value);
        }

        const result = await request.execute(procedure);

        return res.status(200).json({
            success: true,
            message: "Success",
            data: result.recordset || [],
            rowsAffected: result.rowsAffected?.[0] || 0
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

module.exports = router;