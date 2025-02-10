const { MongoClient, ServerApiVersion } = require("mongodb");

let dbInstance = null; // Singleton instance for database connection

/**
 * Establishes a connection to the MongoDB database.
 * Uses a singleton pattern to prevent multiple connections.
 *
 * @returns {Promise<import("mongodb").Db>} - A promise that resolves to the database instance.
 * @throws {Error} - Throws an error if the connection fails.
 */
async function connectToDatabase() {
  // Return existing connection if already established
  if (dbInstance) return dbInstance;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MongoDB URI is not defined");
  }

  // Create a new MongoDB client with recommended settings
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect(); // Establish the database connection
    dbInstance = client.db(); // Store the database instance
    return dbInstance;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err; // Re-throw the error for better error handling
  }
}

module.exports = connectToDatabase;
