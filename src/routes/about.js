const express = require("express");
const router = express.Router();

/**
 * GET /api
 * Retrieves a list of developers.
 *
 * @route GET /
 * @group Developers - Operations related to developers
 * @returns {Object} 200 - A JSON object containing a list of developers.
 */
router.get("/", (req, res) => {
  const developers = [
    { first_name: "Adir", last_name: "Kandabi" },
    { first_name: "Ben", last_name: "Simany" },
  ];

  return res.status(200).json({ developers });
});

module.exports = router;
