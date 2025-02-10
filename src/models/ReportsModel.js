const BaseModel = require("./BaseModel");

class ReportsModel extends BaseModel {
  constructor() {
    super("reports"); // collection name
  }
  async create(report) {
    return this.collection.insertOne(report);
  }
  async findReport(id, month, year) {
    return await this.collection.findOne({
      userid: id,
      month: month,
      year: year,
    });
  }

  async updateReport(id, month, year, report) {
    return await this.collection.updateOne(
      {
        userid: id,
        month: month,
        year: year,
      },
      { $set: { costs: report } }
    );
  }
}
module.exports = ReportsModel;
