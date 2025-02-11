const express = require("express");
const aboutRouter = require("./about.js");
const userRouter = require("./users.js");
const addRouter = require("./add.js");
const reportRouter = require("./report.js");
const router = express.Router();

/**
 * Main API Router
 *
 * @module routes
 * @description This module defines the main API routes and delegates them to subrouters.
 */

/**
 * @route GET /about
 * @description Provides information about the API and developers.
 * @returns {Object} 200 - JSON object containing developer details.
 */
router.use("/about", aboutRouter);

/**
 * @route /users
 * @description Routes related to user management.
 */
router.use("/users", userRouter);

/**
 * @route /add
 * @description Routes related to adding cost items.
 */
router.use("/add", addRouter);

/**
 * @route /report
 * @description Routes related to generating cost reports.
 */
router.use("/report", reportRouter);

module.exports = router;
