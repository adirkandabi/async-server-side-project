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
    console.log("id : " + id);

    return await this.collection.findOne({ id: id });
  }
  async findByFirstName(name) {
    console.log(name);

    return this.collection.findOne({ first_name: name });
  }

  // Add more methods as needed
}

module.exports = UserModel;
