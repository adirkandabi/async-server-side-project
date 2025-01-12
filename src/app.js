require("dotenv").config();
const routes = require("./routes");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
// Middleware
app.use(express.json());

// Use all routes
app.use("/api", routes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
