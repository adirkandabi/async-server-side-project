require("dotenv").config();
const routes = require("./routes/index.js");
const express = require("express");
const connectToDatabase = require("./models/db.js");
const app = express();
let db;

async function startServer() {
  try {
    // Wait for the database connection to be established
    db = await connectToDatabase();
    // Middleware
    app.use(express.json());

    // Use all routes
    app.use("/api", routes);

    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
