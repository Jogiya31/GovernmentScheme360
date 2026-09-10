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

      // Convert blank form fields to SQL NULL and Yes/No strings to boolean.
      if (typeof inputValue === "string") {
        const lower = inputValue.trim().toLowerCase();

        if (lower === "") inputValue = null;
        else if (lower === "yes") inputValue = true;
        else if (lower === "no") inputValue = false;
        else if (lower === "true") inputValue = true;
        else if (lower === "false") inputValue = false;
      }

      if (inputValue !== undefined) {
        request.input(key, inputValue);
      }
    });

    const result = await request.execute(procedure);

    // Handle GetSchemeDetailsByID (Multiple Result Sets)
    if (procedure === "SchemeDetails.usp_GetSchemeDetailsByID") {
      const rs = result.recordsets;

      return res.status(200).json({
        success: true,
        data: {
          SchemeMaster: rs[0]?.[0] || null,
          SchemeRisks: rs[1]?.[0] || null,
          SchemeTimeline: rs[2]?.[0] || null,
          SchemeEligibility: rs[3]?.[0] || null,
          SchemeFinancials: rs[4]?.[0] || null,
          SchemeGeography: rs[5]?.[0] || null,
          SchemeBeneficiaries: rs[6]?.[0] || null,
          SchemeClassification: rs[7]?.[0] || null,
          SchemeObjectives: rs[8]?.[0] || null,
          SchemeState: rs[9] || [],
          SchemeDistrict: rs[10] || [],
          SchemeSDG: rs[11] || [],
          SchemeSimilar: rs[12] || [],
          SchemeComplementary: rs[13] || [],
          SchemeConvergence: rs[14] || [],
          SchemeDuplicate: rs[15] || [],
          SchemeStakeholders: rs[16] || [],
          SchemeRelationships: rs[17]?.[0] || null,
          SchemeOutcomes: rs[18]?.[0] || null,
          SchemeMission: rs[19]?.[0] || null,
          SchemeImplementation: rs[20]?.[0] || null,
          SchemeBenefits: rs[21]?.[0] || null,
        },
      });
    }

    // Default response for all other procedures
    return res.status(200).json({
      success: true,
      data: result.recordset,
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
