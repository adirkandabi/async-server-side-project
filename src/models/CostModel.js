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
}
module.exports = CostModel;
