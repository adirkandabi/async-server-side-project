const BaseModel = require("./BaseModel");
/**
 * UserModel handles database operations related to users.
 * It extends the BaseModel to inherit common database functionality.
 */
class UserModel extends BaseModel {
  constructor() {
    super("users"); // Define the MongoDB collection name
  }

  /**
   * Inserts a new user document into the database.
   *
   * @param {Object} userData - The user data to be inserted.
   * @returns {Promise<import("mongodb").InsertOneResult>} The result of the insertion.
   */
  async create(userData) {
    return this.collection.insertOne(userData);
  }

  /**
   * Finds a user by a custom ID field.
   *
   * @param {string} id - The custom user ID.
   * @returns {Promise<Object|null>} The matching user document, or null if not found.
   */
  async findByCustomId(id) {
    return this.collection.findOne({ id: id });
  }
}
module.exports = UserModel;
