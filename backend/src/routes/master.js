const express = require("express");
const router = express.Router();

const { connectDB, sql } = require("../db/connection");
const spMap = require("../config/spMap");

const procedureOptions = {
  "SchemeDetails.usp_InsertSchemeBeneficiaries": {
    defaultParams: {
      CreatedBy: "system",
    },
    outputParams: {
      NewBeneficiaryID: sql.BigInt,
    },
  },
  "SchemeDetails.usp_InsertSchemeBenefits": {
    defaultParams: {
      CreatedBy: "system",
    },
    outputParams: {
      NewBenefitID: sql.BigInt,
    },
  },
};

// Common function to execute stored procedure
async function executeStoredProcedure(req, res, procedure) {
  try {
    const pool = await connectDB();
    const request = pool.request();
    const options = procedureOptions[procedure] || {};
    const requestBody = {
      ...(options.defaultParams || {}),
      ...req.body,
    };

    // Add all request body parameters
    Object.entries(requestBody).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        request.input(key, value);
      }
    });

    Object.entries(options.outputParams || {}).forEach(([key, type]) => {
      request.output(key, type);
    });

    const result = await request.execute(procedure);

    return res.status(200).json({
      success: true,
      message: "Success",
      data: result.recordset || [],
      output: result.output || {},
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
