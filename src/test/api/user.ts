export default (agent) => {
  let token;
  describe("testing user API", () => {
    it("should fail to authenticate user", async () => {
      const response = await agent.get("/api/user/weekly");

      expect(response.status).toBe(401);
    });
  });

  it("logs in the user", async () => {
    const response = await agent.post("/api/login").send({
      email: "mock-up@tests.com",
      password: "123456",
    });

    token = response.body.token;
    expect(response.status).toBe(200);
  });

  it("gets the user weekly info", async () => {
    const response = await agent
      .get("/api/user/weekly")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.habits).toBeDefined();
  });
};
