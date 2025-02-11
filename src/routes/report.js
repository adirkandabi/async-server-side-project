const express = require("express");
const router = express.Router();

/**
 * GET / - Fetch user report for a specific month and year.
 *
 * @route GET /
 * @param {string} id - The user ID for the report.
 * @param {number} year - The year of the report.
 * @param {number} month - The month of the report.
 * @returns {object} 200 - A JSON object containing the user's report for the specified month and year.
 * @returns {object} 400 - A JSON object containing an error message if required fields are missing or invalid.
 * @returns {object} 500 - A JSON object containing an internal server error message.
 */
router.get("/", async (req, res) => {
  const { id, year, month } = req.query;
  const missingFields = [];

  // Validate required fields
  if (!id) missingFields.push("id");
  if (!year) missingFields.push("year");
  if (!month) missingFields.push("month");

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "error",
      message: `The following fields are missing: ${missingFields.join(", ")}`,
    });
  }

  const parsedMonth = parseInt(month);
  const parsedYear = parseInt(year);

  // Check if the year and month are valid numbers
  if (!isNaN(parsedYear) || !isNaN(parsedMonth)) {
    return res.status(400).json({
      status: "error",
      message: `year and month fields must be numbers`,
    });
  }

  try {
    const { reports: reportsModel, costs: costModel } = req.app.locals.models;
    const { allowedCategories } = req.app.locals;

    // Retrieve precomputed report if it exists
    const computedReport = await reportsModel.findReport(id, month, year);

    // If a precomputed report exists and it's NOT the current month, return it
    if (computedReport && !isCurrentMonth(parsedMonth, parsedYear)) {
      return res.status(200).json({
        status: "success",
        userid: computedReport.userid,
        month: computedReport.month,
        year: computedReport.year,
        costs: computedReport.costs,
      });
    }

    // Fetch cost details for the given user, month, and year
    const expenses = await costModel.getUserReport(id, parsedMonth, parsedYear);

    // Organize expenses into categories
    const costs = allowedCategories.reduce((acc, category) => {
      acc[category] = expenses
        .filter((doc) => doc.category === category)
        .map((obj) => ({
          sum: obj.sum,
          description: obj.description,
          day: obj.time.getUTCDate(),
        }));
      return acc;
    }, {});

    // If there are costs, update or insert the report
    if (Object.values(costs).some((value) => value.length > 0)) {
      if (computedReport) {
        await reportsModel.updateReport(id, month, year, costs);
      } else {
        await reportsModel.create({ userid: id, month, year, costs });
      }
    }

    // Return the updated/generated report
    return res.status(200).json({
      status: "success",
      userid: id,
      month,
      year,
      costs,
    });
  } catch (error) {
    console.error("Error fetching user report:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});
/**
 * Helper function to check if the given month and year match the current month.
 *
 * @function isCurrentMonth
 * @param {number} month - The month to compare with the current month.
 * @param {number} year - The year to compare with the current year.
 * @returns {boolean} - Returns true if the provided month and year match the current month and year, otherwise false.
 */
function isCurrentMonth(month, year) {
  const currentDate = new Date();
  return (
    year === currentDate.getFullYear() && month === currentDate.getMonth() + 1
  );
}
module.exports = router;
