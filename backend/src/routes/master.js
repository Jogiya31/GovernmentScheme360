const express = require("express");
const router = express.Router();

const { connectDB } = require("../db/connection");
const spMap = require("../config/spMap");

// Common function to execute stored procedure
async function executeStoredProcedure(req, res, procedure) {
  try {
    const pool = await connectDB();
    const request = pool.request();

    // Add all request body parameters
    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        request.input(key, value);
      }
    });

    const result = await request.execute(procedure);

    return res.status(200).json({
      success: true,
      message: "Success",
      data: result.recordset || [],
      rowsAffected: result.rowsAffected?.[0] || 0,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Generate routes dynamically from spMap
Object.entries(spMap).forEach(([routeName, procedure]) => {
  router.post(`/${routeName}`, (req, res) => {
    executeStoredProcedure(req, res, procedure);
  });
});

module.exports = router;
