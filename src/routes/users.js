const express = require("express");
const router = express.Router();

/**
 * GET /:id - Fetch user details by custom ID, including total expenses.
 */
router.get("/:id", async (req, res) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { users: userModel, costs: costsModel } = req.app.locals.models;

    // Find user by custom ID field
    const user = await userModel.findByCustomId(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all expenses associated with the user
    const userExpenses = await costsModel.findAllById(userId);
    const totalSpent = userExpenses.reduce(
      (total, expense) => total + expense.sum,
      0
    );

    return res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      total: totalSpent,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET / - Handle invalid requests to the root of this route.
 */
router.get("/", (req, res) => {
  return res.status(400).json({ error: "API bad request" });
});

module.exports = router;
