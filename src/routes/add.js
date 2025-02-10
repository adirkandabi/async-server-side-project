const express = require("express");
const router = express.Router();

/**
 * POST / - Endpoint to add a cost item
 */
router.post("/", async (req, res) => {
  const body = req.body;
  const missingFields = [];

  // Check for required fields and add missing ones to the array
  if (!body.user_id) missingFields.push("user_id");
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
    const user = await userModel.findByCustomId(body.user_id);
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
        user_id: body.user_id,
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
