const express = require("express");
const router = express.Router();

const aboutRouter = require("./about");

// Register the developers route
router.use("/about", aboutRouter);

module.exports = router;
