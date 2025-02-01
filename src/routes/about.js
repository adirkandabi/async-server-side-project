const express = require("express");
const router = express.Router();

// Endpoint to display developers names
router.get("/", (req, res) => {
  const developers = [
    { first_name: "Adir", last_name: "Kandabi" },
    { first_name: "Ben", last_name: "Simany" },
  ];

  res.json(developers);
});

module.exports = router;
