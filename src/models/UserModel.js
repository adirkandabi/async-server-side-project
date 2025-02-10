const BaseModel = require("./BaseModel");

class UserModel extends BaseModel {
  constructor() {
    super("users"); // collection name
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
  async findByCustomId(id) {
    return await this.collection.findOne({ id: id });
  }
  async updateTotalSpent(userId, sum) {
    return await this.collection.updateOne(
      { id: userId }, // Find the user by ID
      { $inc: { total_spent: sum } } // Increment the total_spent field
    );
  }

  // Add more methods as needed
}

module.exports = UserModel;
