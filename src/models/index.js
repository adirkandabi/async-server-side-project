const UserModel = require("./UserModel");
// Import other models...

class Models {
  constructor() {
    this.users = new UserModel();
    // Initialize other models...
  }

  async init(db) {
    await this.users.init(db);
    // Initialize other models...
  }
}

module.exports = Models;
