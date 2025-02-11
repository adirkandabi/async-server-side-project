class BaseModel {
  /**
   * Creates an instance of BaseModel.
   * This serves as a generic base class for database collections,
   * providing common functionality for interacting with MongoDB.
   *
   * @param {string} collectionName - The name of the MongoDB collection.
   */
  constructor(collectionName) {
    this.collectionName = collectionName;
    /** @type {import("mongodb").Collection | null} */
    this.collection = null; // Will be initialized with a MongoDB collection instance
  }

  /**
   * Initializes the database collection.
   *
   * @param {import("mongodb").Db} db - The MongoDB database instance.
   * @returns {Promise<void>} Resolves when the collection is initialized.
   */
  async init(db) {
    this.collection = db.collection(this.collectionName);
  }
}

module.exports = BaseModel;
