const CostModel = require("./CostModel");
const UserModel = require("./UserModel");
const ReportsModel = require("./ReportsModel");

class Models {
  constructor() {
    this.users = new UserModel();
    this.costs = new CostModel();
    this.reports = new ReportsModel();
  }

  async init(db) {
    await this.users.init(db);
    await this.costs.init(db);
    await this.reports.init(db);
  }
}

module.exports = Models;
