const BaseModel = require("./BaseModel");

/**
 * CostModel represents the "costs" collection in the database.
 * It extends BaseModel to provide methods for handling cost-related operations.
 */
class CostModel extends BaseModel {
  /**
   * Creates an instance of CostModel.
   * Specifies "costs" as the MongoDB collection name.
   */
  constructor() {
    super("costs"); // Specify the MongoDB collection name
  }

  /**
   * Finds all cost records associated with a given user ID.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of cost documents.
   */
  async findAllById(id) {
    return this.collection.find({ user_id: id }).toArray();
  }

  /**
   * Finds a single cost record by its unique document ID.
   *
   * @param {string} id - The document ID (_id).
   * @returns {Promise<Object|null>} A promise that resolves to the cost document or null if not found.
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Inserts a new cost record into the collection.
   *
   * @param {Object} costData - The cost data to be inserted.
   * @returns {Promise<import("mongodb").InsertOneResult>} A promise that resolves to the result of the insertion.
   */
  async create(costData) {
    return this.collection.insertOne(costData);
  }

  /**
   * Finds a single cost record by user ID.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<Object|null>} A promise that resolves to the first matching cost document or null.
   */
  async findByUserId(id) {
    return this.collection.findOne({ user_id: id });
  }

  /**
   * Retrieves all cost records for a specific user within a given month and year.
   *
   * @param {string} userId - The user ID.
   * @param {number} month - The month (1-12).
   * @param {number} year - The year (YYYY).
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of cost documents.
   */
  async getUserReport(userId, month, year) {
    const startDate = new Date(year, month - 1, 1); // First day of the given month
    const endDate = new Date(year, month, 1); // First day of the next month

    return this.collection
      .find({
        user_id: userId,
        time: { $gte: startDate, $lt: endDate }, // Filter documents within the given month
      })
      .toArray();
  }
}

module.exports = CostModel;
