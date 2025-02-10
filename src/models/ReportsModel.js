const BaseModel = require("./BaseModel");

/**
 * ReportsModel handles database operations related to user reports.
 * It extends the BaseModel to inherit common functionality.
 */
class ReportsModel extends BaseModel {
  constructor() {
    super("reports"); // Define the MongoDB collection name
  }

  /**
   * Inserts a new report document into the database.
   *
   * @param {Object} report - The report data to be inserted.
   * @returns {Promise<import("mongodb").InsertOneResult>} The result of the insertion.
   */
  async create(report) {
    return this.collection.insertOne(report);
  }

  /**
   * Finds a report based on user ID, month, and year.
   *
   * @param {string} id - The user ID.
   * @param {string} month - The month of the report.
   * @param {string} year - The year of the report.
   * @returns {Promise<Object|null>} The matching report document, or null if not found.
   */
  async findReport(id, month, year) {
    return await this.collection.findOne({
      userid: id,
      month: month,
      year: year,
    });
  }

  /**
   * Updates an existing report by user ID, month, and year.
   * If a report exists, it updates the `costs` field.
   *
   * @param {string} id - The user ID.
   * @param {string} month - The month of the report.
   * @param {string} year - The year of the report.
   * @param {Object} report - The updated report data.
   * @returns {Promise<import("mongodb").UpdateResult>} The result of the update operation.
   */
  async updateReport(id, month, year, report) {
    return await this.collection.updateOne(
      {
        userid: id,
        month: month,
        year: year,
      },
      { $set: { costs: report } }
    );
  }
}

module.exports = ReportsModel;
