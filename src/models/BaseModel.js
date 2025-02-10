class BaseModel {
  /**
   * BaseModel serves as a generic base class for database collections.
   * It provides a foundation for models to interact with MongoDB collections.
   *
   * @param {string} collectionName - The name of the MongoDB collection.
   */
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = null; // Will be initialized with a MongoDB collection instance
  }

  /**
   * Initializes the database collection.
   *
   * @param {Object} db - The MongoDB database instance.
   */
  async init(db) {
    this.collection = db.collection(this.collectionName);
  }
}

module.exports = BaseModel;
