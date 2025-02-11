/**
 * @module tests/users
 * @description Test cases for user-related API endpoints.
 */

const request = require("supertest");
const { app } = require("./setup");

describe("User API Endpoints", () => {
  /* User ID that satisfies the minimum length condition */
  const validUserId = "12345";
  let newUser;

  /**
   * Test suite for user creation endpoint
   * @group POST /api/users
   */
  describe("POST /api/users", () => {
    /* Test for successful user creation with valid input */
    it("should successfully create a new user", async () => {
      const response = await request(app).post("/api/users").send({
        id: validUserId,
        first_name: "John",
        last_name: "Doe",
        birthday: "1985-05-15",
        marital_status: "married",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.id).toBe(validUserId);
      expect(response.body.first_name).toBe("John");

      /* Save the newly created user for further tests */
      newUser = response.body;
    });

    /* Test validation for user ID format */
    it("should return an error if the ID format is invalid", async () => {
      const response = await request(app).post("/api/users").send({
        id: "123", // Invalid: ID is shorter than 5 characters
        first_name: "Invalid",
        last_name: "User",
        birthday: "1985-05-15",
        marital_status: "married",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toMatch(/Invalid ID/);
    });
  });

  /**
   * Test suite for retrieving user details by ID
   * @group GET /api/users/:id
   */
  describe("GET /api/users/:id", () => {
    /* Test for successful user retrieval by a valid ID */
    it("should return user information for a valid ID", async () => {
      const response = await request(app).get(`/api/users/${validUserId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(validUserId);
      expect(response.body).toHaveProperty("total");
    });

    /* Test for handling requests for non-existing users */
    it("should return 404 if the user does not exist", async () => {
      const response = await request(app).get("/api/users/99999");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toMatch(/User not found/);
    });
  });
});
