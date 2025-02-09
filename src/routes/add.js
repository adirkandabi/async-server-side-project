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
    res.status(400).json({
      status: "error",
      message: "The following fields are missing : " + missingFields.join(","),
    });
  } else {
    try {
      if (!req.app.locals.allowedCategories.includes(body.category)) {
        res.status(400).json({
          status: "error",
          message: `category ${body.category} is not supported`,
        });
      } else {
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
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
module.exports = router;
