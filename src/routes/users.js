const express = require("express");
const router = express.Router();

// Endpoint to get details of specific user
router.get("/", async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const UserModel = req.app.locals.models.users;
    // Find by custom id field
    const user = await UserModel.findByCustomId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        total: user.total_spent,
      });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
