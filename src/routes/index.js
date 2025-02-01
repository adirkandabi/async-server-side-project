const express = require("express");
const aboutRouter = require("./about.js");
const userRouter = require("./users.js");
const router = express.Router();

// Register the developers route
router.use("/about", aboutRouter);
router.use("/users", userRouter);
module.exports = router;
