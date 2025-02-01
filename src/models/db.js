const { MongoClient, ServerApiVersion } = require("mongodb");
let dbInstance = null;

async function connectToDatabase() {
  if (dbInstance) return dbInstance;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MongoDB URI is not defined");
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    dbInstance = client.db();
    return dbInstance;
  } catch (err) {
    console.error("MongoDB Atlas Connection Error:", err);
    throw err;
  }
}

module.exports = connectToDatabase;
