const express = require("express");
const router = express.Router();

// Endpoint to get details of specific user
router.get("/", async (req, res) => {
  const { id, year, month } = req.query;
  const missingFields = [];
  if (!id) missingFields.push("id");
  if (!year) missingFields.push("year");
  if (!month) missingFields.push("month");
  if (!missingFields.length) {
    res.status(400).json({
      status: "error",
      message:
        "The following fields are missing : " + missingFields.splice(","),
    });
  }
});
