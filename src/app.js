// app.js
require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./models/db.js");
const Models = require("./models");
const routes = require("./routes/index.js");

const app = express();
const models = new Models();

async function startServer() {
  try {
    const db = await connectToDatabase();
    await models.init(db);

    // Add models to app locals so they're accessible in routes
    app.locals.models = models;

    app.use(express.json());
    app.use("/api", routes);

    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
