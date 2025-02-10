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
  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "The following fields are missing : " + missingFields.join(","),
    });
  } else {
    try {
      if (!req.app.locals.allowedCategories.includes(body.category)) {
        return res.status(400).json({
          status: "error",
          message: `category ${body.category} is not supported`,
        });
      } else {
        const userModel = req.app.locals.models.users;
        const costModel = req.app.locals.models.costs;
        const user = await userModel.findByCustomId(body.user_id);
        if (!user) {
          return res
            .status(404)
            .json({ status: "error", message: "User does not exist" });
        }
        const result = await costModel.create(body);
        if (!result.acknowledged) {
          return res
            .status(500)
            .json({ status: "error", message: "The cost could not be added" });
        }
        const newCost = {
          user_id: body.user_id,
          category: body.category,
          description: body.description,
          sum: body.sum,
          time: body.time,
        };
        return res.status(200).json({ status: "success", new_cost: newCost });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});
module.exports = router;
