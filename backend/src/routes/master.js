// src/routes/master.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { connectDB } = require("../db/connection");
const spMap = require("../config/spMap");
const { authenticateToken, JWT_SECRET } = require("../middleware/auth");

// Define which routes do NOT require a token (public routes)
const PUBLIC_ROUTES = new Set([
  "Login",
  "ForgotPassword",
  "NewUser",
]);

async function executeStoredProcedure(req, res, procedure, routeName) {
  try {
    const pool = await connectDB();
    const request = pool.request();

    // Map req.body fields to SQL inputs
    Object.entries(req.body).forEach(([key, value]) => {
      let inputValue = value;
      console.log(`Mapping request body field: ${key} = ${inputValue}`);
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
    const row = result.recordset?.[0];

    // =========================================================================
    // SPECIAL HANDLER 1: LOGIN (Mint JWT Token)
    // =========================================================================
    if (routeName === "Login") {
      if (!row || row.StatusCode !== 200) {
        return res.status(row?.StatusCode || 400).json({
          success: false,
          message: row?.StatusMessage || "Invalid email or password",
        });
      }

      // Generate JWT Access Token (valid for 2 hours)
      const tokenPayload = {
        userId: row.UserID,
        email: row.Email,
        name: row.FullName,
        role: row.RoleName,
        departmentId: row.DepartmentID,
        departmentName: row.DepartmentName,
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "2h" });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        refreshToken: row.RefreshToken,
        user: {
          id: row.UserID,
          name: row.FullName,
          email: row.Email,
          role: row.RoleName,
          department: row.DepartmentName,
          departmentId: row.DepartmentID,
          theme: row.ThemeMode,
          colorPreset: row.ColorPreset,
        },
      });
    }

    // =========================================================================
    // SPECIAL HANDLER 2: NEW USER REGISTRATION (Mint JWT Token on Signup)
    // =========================================================================
    if (routeName === "NewUser") {
      if (!row || row.StatusCode !== 201) {
        return res.status(row?.StatusCode || 400).json({
          success: false,
          message: row?.StatusMessage || "Registration failed",
        });
      }

      const tokenPayload = {
        userId: row.UserID,
        email: row.Email,
        name: row.FullName
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "2h" });

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: row.UserID,
          name: row.FullName,
          email: row.Email,
        },
      });
    }

    // =========================================================================
    // SPECIAL HANDLER 3: SchemeDetails (Multiple Result Sets)
    // =========================================================================
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

    // =========================================================================
    // DEFAULT HANDLER (Dropdowns, Inserts, Updates)
    // =========================================================================
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

// Dynamically mount routes:
// - If public (Login, ForgotPassword, NewUser), no token required.
// - If private (setSchemeMaster, updateSchemeMaster, etc.), require authenticateToken.
Object.entries(spMap).forEach(([routeName, procedure]) => {
  const isPublic = PUBLIC_ROUTES.has(routeName) || routeName.endsWith("ForDropdown");

  if (isPublic) {
    router.post(`/${routeName}`, (req, res) => {
      executeStoredProcedure(req, res, procedure, routeName);
    });
  } else {
    // Protected with JWT middleware
    router.post(`/${routeName}`, authenticateToken, (req, res) => {
      executeStoredProcedure(req, res, procedure, routeName);
    });
  }
});

module.exports = router;