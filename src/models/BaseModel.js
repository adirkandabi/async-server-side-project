class BaseModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = null;
  }

  async init(db) {
    this.collection = db.collection(this.collectionName);
  }
}

module.exports = BaseModel;
