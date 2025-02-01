const { MongoClient } = require("mongodb");

async function connectToDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MongoDB URI is not defined");
  }

  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Temporarily disable SSL verification for debugging
      tlsAllowInvalidCertificates: true,
      // Add more connection options
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("Successfully connected to MongoDB");
    return client.db();
  } catch (err) {
    console.error("MongoDB Connection Error Details:", {
      message: err.message,
      code: err.code,
      name: err.name,
    });
    throw err;
  }
}

module.exports = connectToDatabase;
