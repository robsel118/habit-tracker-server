import moment from "moment";

export default (agent) => {
  describe("Auth API", () => {
    it("should not register with invalide email", async () => {
      const response = await agent
        .post("/api/register")
        .send({ username: "robert", email: "robert", password: "123456" });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Bad Request");
    });

    it("should register a user", async () => {
      const response = await agent.post("/api/register").send({
        username: "robert",
        email: "mock-up@tests.com",
        password: "123456",
        lastConnected: moment("09-19-2020", "MM-DD-YYYY").toDate(),
      });
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it("should not register an existing user", async () => {
      const response = await agent.post("/api/register").send({
        username: "robert",
        email: "mock-up@tests.com",
        password: "123456",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Bad Request");
    });

    it("should login the user", async () => {
      const response = await agent.post("/api/login").send({
        email: "mock-up@tests.com",
        password: "123456",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });
};
