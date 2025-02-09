const express = require("express");
const router = express.Router();

// Endpoint to get details of specific user
router.get("/", async (req, res) => {
  const { id, year, month } = req.query;
  const missingFields = [];
  if (!id) missingFields.push("id");
  if (!year) missingFields.push("year");
  if (!month) missingFields.push("month");

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "The following fields are missing: " + missingFields.join(", "),
    });
  }

  try {
    const reportsModel = req.app.locals.models.reports;
    const costModel = req.app.locals.models.costs;
    const allowedCategories = req.app.locals.allowedCategories;
    const computedReports = await reportsModel.findReport(id, month, year);
    if (computedReports && !isCurrentMonth(parseInt(month), parseInt(year))) {
      res.status(200).json({
        status: "success",
        userid: computedReports.userid,
        month: computedReports.month,
        year: computedReports.year,
        costs: computedReports.costs,
      });
    } else {
      const expenses = await costModel.getUserReport(
        id,
        parseInt(month),
        parseInt(year)
      );

      const costs = {};
      allowedCategories.forEach((category) => {
        const currCategoryObjs = expenses.filter(
          (doc) => doc.category === category
        );
        costs[category] = [];
        currCategoryObjs.forEach((obj) => {
          costs[category].push({
            sum: obj.sum,
            description: obj.description,
            day: obj.time.getUTCDate(),
          });
        });
      });
      if (
        !Object.values(costs).every(
          (value) => Array.isArray(value) && value.length === 0
        )
      ) {
        if (computedReports) {
          await reportsModel.updateReport(id, month, year, costs);
        } else {
          await reportsModel.create({
            userid: id,
            month: month,
            year: year,
            costs: costs,
          });
        }
      }

      res.status(200).json({
        status: "success",
        userid: id,
        month: month,
        year: year,
        costs: costs,
      });
    }
  } catch (error) {
    console.error("Error fetching user report:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
});
function isCurrentMonth(month, year) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0 for January, so add 1

  if (year < currentYear) {
    return false; // The year is already in the past
  }

  if (year === currentYear && month < currentMonth) {
    return false; // The month has already passed within the current year
  }

  return true; // It's either the current month or a future month
}
module.exports = router;
