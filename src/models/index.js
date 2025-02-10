const CostModel = require("./CostModel");
const UserModel = require("./UserModel");
const ReportsModel = require("./ReportsModel");

/**
 * A centralized class for managing database models.
 * This ensures all models are initialized properly and can be accessed easily.
 */
class Models {
  constructor() {
    // Initialize model instances
    this.users = new UserModel();
    this.costs = new CostModel();
    this.reports = new ReportsModel();
  }

  /**
   * Initializes all models by setting up their database collections.
   * This method should be called after connecting to the database.
   *
   * @param {import("mongodb").Db} db - The MongoDB database instance.
   * @returns {Promise<void>}
   */
  async init(db) {
    await this.users.init(db);
    await this.costs.init(db);
    await this.reports.init(db);
  }
}

module.exports = Models;
