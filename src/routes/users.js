const express = require("express");
const router = express.Router();

// Endpoint to get details of specific user
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const userModel = req.app.locals.models.users;
    const costsModel = req.app.locals.models.costs;
    // Find by custom id field
    const user = await userModel.findByCustomId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userExpenses = await costsModel.findAllById(userId);
    let totalSpent = 0;
    userExpenses.forEach((expense) => {
      totalSpent += expense.sum;
    });
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
router.get("/", async (req, res) => {
  return res.status(400).json({ error: "API bad request" });
});
module.exports = router;
