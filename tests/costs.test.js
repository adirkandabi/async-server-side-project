/**
 * @module tests/expenses
 * @description Test suite for the API endpoints related to expense management.
 */

const request = require("supertest");
const { app } = require("./setup");

describe("Expenses API", () => {
  /* Test user ID for linking expenses */
  const testUserId = "12345";

  /**
   * Setup: Add a test user before running the expense-related tests
   * @function beforeAll
   */
  beforeAll(async () => {
    await request(app).post("/api/users").send({
      id: testUserId,
      first_name: "Expense",
      last_name: "Example",
      birthday: "1990-05-15",
      marital_status: "single",
    });
  });

  /**
   * Test suite for adding an expense via the API
   * @group POST /api/expenses
   */
  describe("POST /api/expenses", () => {
    /* Test successfully adding an expense with valid details */
    it("should successfully add a new expense with correct input", async () => {
      const response = await request(app).post("/api/expenses").send({
        description: "Lunch",
        category: "food",
        userid: testUserId,
        sum: 30,
        date: "2023-11-01",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.description).toBe("Lunch");
      expect(response.body.sum).toBe(30);
    });

    /* Test validation when the amount is negative */
    it("should return an error if the sum is negative", async () => {
      const response = await request(app).post("/api/expenses").send({
        description: "Invalid Data",
        category: "food",
        userid: testUserId,
        sum: -5,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toMatch(/Amount must be a positive number/);
    });

    /* Test response when trying to add an expense for a non-existing user */
    it("should return an error if the user does not exist", async () => {
      const response = await request(app).post("/api/expenses").send({
        description: "Non-Existent User Expense",
        category: "transport",
        userid: "67890",
        sum: 15,
      });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toMatch(/User not found/);
    });
  });

  /**
   * Test suite for retrieving expenses via the API
   * @group GET /api/expenses
   */
  describe("GET /api/expenses", () => {
    /* Test retrieving all expenses from the API */
    it("should return all expenses stored in the system", async () => {
      const response = await request(app).get("/api/expenses");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      /* Check if the test expense (Lunch) was created successfully */
      const lunchExpense = response.body.find(
        (expense) => expense.description === "Lunch"
      );
      expect(lunchExpense).toBeDefined();
    });
  });
});
