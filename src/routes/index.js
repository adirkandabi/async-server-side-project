const express = require("express");
const aboutRouter = require("./about.js");
const userRouter = require("./users.js");
const addRouter = require("./add.js");
const reportRouter = require("./report.js");
const router = express.Router();

router.use("/about", aboutRouter);
router.use("/users", userRouter);
router.use("/add", addRouter);
router.use("/report", reportRouter);
module.exports = router;
