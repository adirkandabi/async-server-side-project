const express = require("express");
const aboutRouter = require("./about.js");
const userRouter = require("./users.js");
const addRouter = require("./add.js");
const router = express.Router();

router.use("/about", aboutRouter);
router.use("/users", userRouter);
router.use("/add", addRouter);
module.exports = router;
