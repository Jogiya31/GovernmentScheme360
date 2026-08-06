const express = require("express");
const router = express.Router();

const { connectDB } = require("../db/connection");
const spMap = require("../config/spMap");

async function executeStoredProcedure(req, res, procedure) {
  try {
    const pool = await connectDB();
    const request = pool.request();

    Object.entries(req.body).forEach(([key, value]) => {
      let inputValue = value;

      // Convert Yes/No to boolean
      if (typeof inputValue === "string") {
        const lower = inputValue.toLowerCase();

        if (lower === "yes") inputValue = true;
        else if (lower === "no") inputValue = false;
        else if (lower === "true") inputValue = true;
        else if (lower === "false") inputValue = false;
      }

      if (inputValue !== undefined && inputValue !== null) {
        request.input(key, inputValue);
      }
    });


    const result = await request.execute(procedure);

    return res.status(200).json({
      success: true,
            data: result.recordset
    });
  } catch (error) {
    console.error(`Error executing ${procedure}:`, error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

Object.entries(spMap).forEach(([routeName, procedure]) => {
  router.post(`/${routeName}`, (req, res) => {
    executeStoredProcedure(req, res, procedure);
  });
});

module.exports = router;
