const BaseModel = require("./BaseModel");

class CostModel extends BaseModel {
  constructor() {
    super("costs"); // collection name
  }

  async findAll() {
    return this.collection.find({}).toArray();
  }

  async findById(id) {
    return this.collection.findOne({ _id: id });
  }

  async create(userData) {
    return this.collection.insertOne(userData);
  }
  async findByUserId(id) {
    return await this.collection.findOne({ user_id: id });
  }
  async getUserReport(userId, month, year) {
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 1); // First day of the next month
    return await this.collection
      .find({
        user_id: userId,
        time: { $gte: startDate, $lt: endDate }, // Match documents within the month
      })
      .toArray();
  }
}
module.exports = CostModel;
