require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./models/db.js");
const Models = require("./models");
const routes = require("./routes/index.js");

const app = express();
const models = new Models();

async function startServer() {
  try {
    // Connect to the database
    const db = await connectToDatabase();
    await models.init(db);

    // Add models and other global settings to app.locals
    app.locals.models = models;
    app.locals.allowedCategories = [
      "food",
      "health",
      "housing",
      "sport",
      "education",
    ];

    // Middleware
    app.use(express.json());

    // Routes
    app.use("/api", routes);

    // Server listening
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Start the server
startServer();
