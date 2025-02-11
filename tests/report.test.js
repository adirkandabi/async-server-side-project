/**
 * @module tests/expense-report
 * @description Test suite for generating expense reports through the API
 */

const request = require("supertest");
const { app } = require("./setup");

/**
 * Test suite for generating reports related to expenses
 * @group Report API
 */
describe("Expense Report API", () => {
  /* User ID for generating reports */
  const testUserId = "99999";

  /**
   * Setup: Create a test user and add sample expenses before tests
   * @function beforeAll
   */
  beforeAll(async () => {
    /* Create a test user */
    await request(app).post("/api/users").send({
      id: testUserId,
      first_name: "Report",
      last_name: "Generator",
      birthday: "1993-08-20",
      marital_status: "single",
    });

    /* Add rent expense */
    await request(app).post("/api/expenses").send({
      description: "Rent Payment",
      category: "housing",
      userid: testUserId,
      sum: 1200,
      date: "2024-02-01",
    });

    /* Add gym expense */
    await request(app).post("/api/expenses").send({
      description: "Gym Membership",
      category: "sport",
      userid: testUserId,
      sum: 180,
      date: "2024-02-05",
    });
  });

  /* Test generation of monthly report with correct totals */
  it("should generate a report for the month with all categories and correct total sums", async () => {
    const response = await request(app)
      .get("/api/report")
      .query({ id: testUserId, year: "2024", month: "2" });

    /* Check basic report properties */
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(testUserId);
    expect(response.body.month).toBe(2);
    expect(response.body.year).toBe(2024);

    /* Verify that all expense categories are included in the report */
    const categories = ["food", "health", "housing", "sport", "education"];
    categories.forEach((category) => {
      const categoryItem = response.body.categories.find(
        (cat) => cat.category === category
      );
      expect(categoryItem).toBeDefined();
    });

    /* Check categories with recorded expenses */
    const housing = response.body.categories.find(
      (cat) => cat.category === "housing"
    );
    const sport = response.body.categories.find(
      (cat) => cat.category === "sport"
    );
    expect(housing.categoryTotal).toBe(1200);
    expect(housing.expensesCount).toBe(1);
    expect(sport.categoryTotal).toBe(180);
    expect(sport.expensesCount).toBe(1);

    /* Verify categories without expenses */
    const food = response.body.categories.find(
      (cat) => cat.category === "food"
    );
    const health = response.body.categories.find(
      (cat) => cat.category === "health"
    );
    const education = response.body.categories.find(
      (cat) => cat.category === "education"
    );

    expect(food.categoryTotal).toBe(0);
    expect(food.expensesCount).toBe(0);
    expect(food.expenses).toHaveLength(0);

    expect(health.categoryTotal).toBe(0);
    expect(health.expensesCount).toBe(0);
    expect(health.expenses).toHaveLength(0);

    expect(education.categoryTotal).toBe(0);
    expect(education.expensesCount).toBe(0);
    expect(education.expenses).toHaveLength(0);

    /* Verify overall report summary */
    expect(response.body.summary.totalAmount).toBe(1380); // 1200 + 180
    expect(response.body.summary.totalCategories).toBe(2); // housing, sport
    expect(response.body.summary.totalExpenses).toBe(2); // two expenses
  });

  /* Test report generation for a period with no recorded expenses */
  it("should return all categories with zero amounts if no expenses are recorded", async () => {
    const response = await request(app)
      .get("/api/report")
      .query({ id: testUserId, year: "2023", month: "12" });

    expect(response.statusCode).toBe(200);
    expect(response.body.categories).toHaveLength(5);

    /* Ensure all categories have zero values */
    response.body.categories.forEach((category) => {
      expect(category.categoryTotal).toBe(0);
      expect(category.expensesCount).toBe(0);
      expect(category.expenses).toHaveLength(0);
    });

    /* Check that the summary reflects no expenses */
    expect(response.body.summary.totalAmount).toBe(0);
    expect(response.body.summary.totalCategories).toBe(0);
    expect(response.body.summary.totalExpenses).toBe(0);
  });

  /* Test validation for missing parameters */
  it("should return an error when required parameters are missing", async () => {
    /* Missing year parameter */
    let response = await request(app)
      .get("/api/report")
      .query({ id: testUserId, month: "2" });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Year parameter is required/);

    /* Missing month parameter */
    response = await request(app)
      .get("/api/report")
      .query({ id: testUserId, year: "2024" });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Month parameter is required/);
  });
});
