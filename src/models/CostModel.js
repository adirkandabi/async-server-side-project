const BaseModel = require("./BaseModel");

class CostModel extends BaseModel {
  /**
   * CostModel represents the "costs" collection in the database.
   * It extends BaseModel to inherit common database functionality.
   */
  constructor() {
    super("costs"); // Specify the MongoDB collection name
  }

  /**
   * Finds all cost records associated with a given user ID.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<Array>} - A promise that resolves to an array of cost documents.
   */
  async findAllById(id) {
    return this.collection.find({ user_id: id }).toArray();
  }

  /**
   * Finds a single cost record by its unique document ID.
   *
   * @param {string} id - The document ID (_id).
   * @returns {Promise<Object|null>} - A promise that resolves to the cost document or null if not found.
   */
  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Inserts a new cost record into the collection.
   *
   * @param {Object} userData - The cost data to be inserted.
   * @returns {Promise<Object>} - A promise that resolves to the inserted document's result.
   */
  async create(userData) {
    return this.collection.insertOne(userData);
  }

  /**
   * Finds a single cost record by user ID.
   *
   * @param {string} id - The user ID.
   * @returns {Promise<Object|null>} - A promise that resolves to the first matching cost document or null.
   */
  async findByUserId(id) {
    return await this.collection.findOne({ user_id: id });
  }

  /**
   * Retrieves all cost records for a specific user within a given month and year.
   *
   * @param {string} userId - The user ID.
   * @param {number} month - The month (1-12).
   * @param {number} year - The year (YYYY).
   * @returns {Promise<Array>} - A promise that resolves to an array of cost documents.
   */
  async getUserReport(userId, month, year) {
    const startDate = new Date(year, month - 1, 1); // First day of the given month
    const endDate = new Date(year, month, 1); // First day of the next month

    return await this.collection
      .find({
        user_id: userId,
        time: { $gte: startDate, $lt: endDate }, // Filter documents within the given month
      })
      .toArray();
  }
}

module.exports = CostModel;
