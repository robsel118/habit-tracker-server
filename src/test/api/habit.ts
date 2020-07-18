export default (agent) => {
  describe("Testing habit and completion API", () => {
    let token, habitId;
    it("should login the user", async () => {
      const response = await agent.post("/api/login").send({
        email: "mock-up@tests.com",
        password: "123456",
      });
      token = response.body.token;

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it("should not create a habit", async () => {
      const response = await agent
        .post("/api/habits")
        .set("Authorization", token)
        .send({
          name: "workout",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request");
    });

    it("should create a habit", async () => {
      const response = await agent
        .post("/api/habits")
        .set("Authorization", token)
        .send({
          name: "booze",
          frequency: [0, 2, 4],
          not: true,
        });
      habitId = response.body.habit._id;
      expect(response.status).toBe(200);
      expect(response.body.habit.name).toBe("booze");
      expect(response.body.habit.not);
      expect(response.body.user).toBeDefined();
    });

    it("should get the user's habit", async () => {
      const response = await agent
        .get("/api/habits")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.habits.length).toBe(1);
    });
  });
};
