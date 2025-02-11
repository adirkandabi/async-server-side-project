require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./models/db.js");
const Models = require("./models");
const routes = require("./routes/index.js");

const app = express();
const models = new Models();

/**
 * Starts the Express server and connects to the database.
 *
 * This function connects to the database, initializes the models, sets up global settings
 * like allowed categories, applies middleware, and routes. If everything is successful,
 * it starts the server on the specified port.
 *
 * @async
 * @throws {Error} If there's any failure during database connection or server startup.
 */
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

    // Middleware to parse incoming requests with JSON payloads
    app.use(express.json());

    // Use routes for API endpoint
    app.use("/api", routes);

    // Server listening on specified port
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
