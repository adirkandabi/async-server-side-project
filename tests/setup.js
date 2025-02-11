/**
 * @module tests/setup
 * @description Configuration for the test environment setup and teardown processes.
 */

const mongoose = require("mongoose");
const app = require("../app");

/* Instance of the server used in tests */
let testServer;

/**
 * Performs global setup before running the tests.
 * Establishes a connection to the MongoDB test database and starts the test server.
 * @async
 * @function beforeAll
 */
beforeAll(async () => {
  try {
    /* Establish connection to the MongoDB test database */
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "test-db",
    });

    /* Ensure the connection to the database is established */
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once("connected", resolve);
      }
    });

    /* Clean up any existing test data before running the tests */
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }

    /* Start the server on an available random port */
    return new Promise((resolve) => {
      testServer = app.listen(0, () => {
        console.log("Test server is running...");
        resolve();
      });
    });
  } catch (err) {
    console.error("Error during setup:", err);
    throw err;
  }
});

/**
 * Global teardown after tests are finished.
 * Closes the database connection and shuts down the test server.
 * @async
 * @function afterAll
 */
afterAll(async () => {
  try {
    /* Close the database connection */
    if (mongoose.connection) {
      await mongoose.connection.close();
    }

    /* Stop the test server */
    if (testServer) {
      await new Promise((resolve) => testServer.close(resolve));
    }
  } catch (err) {
    console.error("Error during cleanup:", err);
    throw err;
  }
});

/**
 * Export the app and test server instances for use in test files.
 * @exports {Object}
 * @property {Express} app - The Express application instance.
 * @property {http.Server} testServer - The HTTP server instance used in tests.
 */
module.exports = { app, testServer };
