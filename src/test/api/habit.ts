import Habit from "../../models/Habit";

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
          name: "workout",
          frequency: [0, 2, 4],
        });
      expect(response.status).toBe(201);
      habitId = response.body._id;
      expect(response.body.name).toBe("workout");
      expect(response.body.not);
    });

    it("should get the user's habits", async () => {
      const response = await agent
        .get("/api/habits")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    it("should get the user's habits", async () => {
      const response = await agent
        .get("/api/habits")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    it("should not update the user's habits", async () => {
      const response = await agent
        .put(`/api/habits/3408230480324234`)
        .set("Authorization", token)
        .send({
          name: "workout 1h",
          frequency: [0, 1, 2, 3, 4],
        });
      // console.log(response);
      expect(response.status).toBe(400);
    });

    it("should update the user's habits", async () => {
      const response = await agent
        .put(`/api/habits/${habitId}`)
        .set("Authorization", token)
        .send({
          name: "workout 1h",
          frequency: [0, 1, 2, 3, 4],
        });
      expect(response.status).toBe(200);
      expect(response.body.frequency).toHaveLength(5);
      expect(response.body.name).toBe("workout 1h");
    });

    it("should retrieve the user's daily of the week for each habit", async () => {
      const response = await agent
        .get(`/api/habits/weekly`)
        .set("Authorization", token);
      expect(response.body.length).toBe(1);
      expect(response.body[0].dailyList.length).toBeGreaterThan(1);
    });

    // it("should get the user's weekly habits and dailys", async () => {
    //   const habit = await Habit.findById(habitId);

    //   const response = await agent
    //     .get("/api/habits/weekly")
    //     .set("Authorization", token);

    //   expect(response.status).toBe(200);
    //   expect(response.body.habits.length).toBe(1);
    // });
  });
};
