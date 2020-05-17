import User, { validateNewUserInfo } from "models/User";
import app from "./app";
import request from "supertest";
import connectDatabase from "./db";
import mongoose from "mongoose";

let server, agent;

beforeAll(async (done) => {
  await connectDatabase(process.env.MONGO_URI);

  server = app.listen(4000, () => {
    agent = request.agent(server);
    done();
  });
});

afterAll((done) => {
  mongoose.disconnect();
  mongoose.connection.close();
  return server && server.close(done);
});

describe("User model", () => {
  it("creates a new user and sets the hash", async () => {
    const user = new User();

    const payload = {
      username: "robert",
      email: "robert@robert.com",
      password: "password",
    };

    user.username = payload.username;
    user.email = payload.email;
    await user.setHash("password");

    expect(validateNewUserInfo(payload));
    expect(user.hash).not.toBeUndefined();
    expect(user.username).toBe(payload.username);
    expect(user.email).toBe(payload.email);
  });
});

describe("Endpoint Access", () => {
  it("should fail to authenticate user", async () => {
    const response = await agent.get("/api/user/me");

    expect(response.status).toBe(401);
  });
});

describe("Auth API", () => {
  it("should not register with invalide email", async () => {
    const response = await agent
      .post("/api/auth/register")
      .send({ username: "robert", email: "robert", password: "123456" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  let userId;

  it("should register a user", async () => {
    const response = await agent.post("/api/auth/register").send({
      username: "robert",
      email: "mock-up@outlook.com",
      password: "123456",
    });

    expect(response.body.token).toBeDefined();
    expect(response.status).toBe(200);
    userId = response.body.user._id;
  });

  it("should not register an existing user", async () => {
    const response = await agent.post("/api/auth/register").send({
      username: "robert",
      email: "mock-up@outlook.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail already registered");
  });
  it("should login the user", async () => {
    const response = await agent.post("/api/auth").send({
      email: "mock-up@outlook.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    await User.findByIdAndDelete({ _id: userId });
  });
});
