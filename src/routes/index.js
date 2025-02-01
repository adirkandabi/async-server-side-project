const express = require("express");
const aboutRouter = require("./about.js");
const router = express.Router();

// Register the developers route
router.use("/about", aboutRouter);
module.exports = router;
