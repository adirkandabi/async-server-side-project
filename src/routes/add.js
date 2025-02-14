const express = require("express");
const router = express.Router();

/**
 * POST / - Adds a cost item to the database.
 *
 * @route POST /
 * @group Costs - Operations related to cost management
 * @param {Object} req.body - The request body containing cost details.
 * @param {string} req.body.userid - The ID of the user associated with the cost.
 * @param {string} req.body.category - The category of the cost.
 * @param {string} req.body.description - A description of the cost.
 * @param {number} req.body.sum - The amount spent.
 * @param {string} [req.body.time] - The timestamp of the cost (defaults to current date if not provided).
 * @returns {Object} 200 - Success response with the newly added cost item.
 * @returns {Object} 400 - Error response if required fields are missing or invalid.
 * @returns {Object} 404 - Error response if the user does not exist.
 * @returns {Object} 500 - Error response for internal server errors.
 */
router.post("/", async (req, res) => {
  const body = req.body;
  const missingFields = [];

  // Check for required fields and add missing ones to the array
  if (!body.userid) missingFields.push("userid");
  if (!body.category) missingFields.push("category");
  if (!body.description) missingFields.push("description");
  if (!body.sum) missingFields.push("sum");

  // Set time field (default to current date if not provided)
  body.time = body.time ? new Date(body.time) : new Date();

  // Return an error response if any required fields are missing
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "error",
      message: `The following fields are missing: ${missingFields.join(", ")}`,
    });
  }

  if (parseInt(body.sum) <= 0) {
    return res.status(400).json({
      status: "error",
      message: "sum field must be greater than zero",
    });
  }

  try {
    const { allowedCategories, models } = req.app.locals;
    const { users: userModel, costs: costModel } = models;

    // Validate category
    if (!allowedCategories.includes(body.category)) {
      return res.status(400).json({
        status: "error",
        message: `Category '${body.category}' is not supported`,
      });
    }

    // Check if user exists
    const user = await userModel.findByCustomId(body.userid);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User does not exist",
      });
    }

    // Insert cost record into the database
    const result = await costModel.create(body);
    if (!result.acknowledged) {
      return res.status(500).json({
        status: "error",
        message: "The cost could not be added",
      });
    }

    // Return success response with newly added cost item
    return res.status(200).json({
      status: "success",
      new_cost: {
        userid: body.userid,
        category: body.category,
        description: body.description,
        sum: body.sum,
        time: body.time,
      },
    });
  } catch (error) {
    console.error("Error adding cost:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

module.exports = router;
