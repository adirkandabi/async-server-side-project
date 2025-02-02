const express = require("express");
const router = express.Router();

// Endpoint to add cost item
router.post("/", async (req, res) => {
  const body = req.body;
  const missingFields = [];
  //insert each missing property to array
  if (!body.user_id) missingFields.push("user_id");
  if (!body.category) missingFields.push("category");
  if (!body.description) missingFields.push("description");
  if (!body.sum) missingFields.push("sum");
  if (!body.time) {
    body.time = new Date();
  } else {
    body.time = new Date(body.time);
  }
  if (missingFields.length) {
    res.status(400).json({
      status: "error",
      message:
        "The following fields are missing : " + missingFields.splice(","),
    });
  } else {
    try {
      //   const userModel = req.app.locals.models.users;
      //   const updateUserSpentRes = await userModel.updateTotalSpent(
      //     body.user_id,
      //     Number(body.sum)
      //   );
      //   if (updateUserSpentRes.matchedCount === 0) {
      //     return res.status(404).json({ error: "User not found" });
      //   }
      const CostModel = req.app.locals.models.costs;
      const result = await CostModel.create(body);
      if (!result.acknowledged) {
        res
          .status(500)
          .json({ status: "error", message: "The cost could not be added" });
      }
      res
        .status(200)
        .json({ status: "success", message: "Cost added successfully" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
module.exports = router;
