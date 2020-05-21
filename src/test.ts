import User, { validateNewUserInfo } from "models/User";
import Habit, { validateHabitData, Day } from "models/Habit";
import Completion from "models/Completion";
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

function generateTestUser() {
  const payload = {
    username: "robert",
    email: "robert@robert.com",
  };
  const testUser = new User({ ...payload });
  testUser.username = payload.username;
  testUser.email = payload.email;
  return testUser;
}

function generateTestHabit() {
  const payload = {
    name: "Eat Junkt",
    frequency: [Day.MONDAY],
    not: true,
  };
  const testHabit = new Habit({ ...payload });
  return testHabit;
}

const token =
  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJoYWJpdHMiOltdLCJfaWQiOiI1ZWMzZmFmN2Y3ZWJkMTY4OTBjN2U4NzMiLCJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaGFzaCI6IiQyYiQxMCR4NnpBeVVqT1p1eVlYSHB5SXNUZHYuNmpES2JhQmoxMDNPT2JVNzl2aWJ1bThTeHdjbU5ibSIsImNyZWF0ZWRBdCI6IjIwMjAtMDUtMTlUMTU6Mjc6NTEuNTk4WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDUtMTlUMTU6Mjc6NTEuNTk4WiIsIl9fdiI6MH0sImlhdCI6MTU4OTkwOTE2NSwiZXhwIjoxNjIxNDQ1MTY1fQ.49b7RP3KrQeYZzgjtQt4QegGSBW6sw0P0Ut4oHEAenk";
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
      email: "mock-up@sharklaser.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    userId = response.body.user._id;
  });

  it("should not register an existing user", async () => {
    const response = await agent.post("/api/auth/register").send({
      username: "robert",
      email: "mock-up@sharklaser.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail already registered");
  });
  it("should login the user", async () => {
    const response = await agent.post("/api/auth/login").send({
      email: "mock-up@sharklaser.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    await User.findByIdAndDelete({ _id: userId });
  });
});

// Habits and completion model
describe("Habit and Completion model", () => {
  it("does not creates a habit", async () => {
    const payload = {
      name: "Work Out",
    };

    expect(validateHabitData(payload)).toBe(false);
  });
  it("creates a habit and assign it to the user", async () => {
    const payload = {
      name: "Eat Junkt",
      frequency: [Day.MONDAY],
      not: true,
    };

    const testUser = generateTestUser();
    const habit = new Habit({ ...payload });
    testUser.habits.push(habit);

    expect(validateHabitData(payload)).toBe(true);
    expect(habit.currentStreak).toBe(0);
    expect(habit.name).toBe(payload.name);
    expect(habit.not);
    expect(habit.frequency.length).toBe(1);
    expect(testUser.habits.length).toBe(1);
    expect(testUser.habits[0]._id).toBe(habit._id);
  });

  it("adds a completion", async () => {
    const testUser = generateTestUser();
    const testHabit = generateTestHabit();
    testUser.habits.push(testHabit);

    const completion = new Completion({ user: testUser });
    completion.habits.push(testHabit);

    expect(completion.user._id).toBe(testUser._id);
    expect(completion.habits[0]._id).toBe(testHabit._id);
  });
});

describe("Testing habit and completion API", () => {
  it("should not create a habit", async () => {
    const response = await agent
      .post("/api/habit/new")
      .set("Authorization", token)
      .send({
        name: "workout",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid data");
  });

  it("should not create a habit due to invalid array", async () => {
    const response = await agent
      .post("/api/habit/new")
      .set("Authorization", token)
      .send({
        name: "workout",
        frequency: [0, 2, 44],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid data");
  });

  it("should create a habit", async () => {
    const response = await agent
      .post("/api/habit/new")
      .set("Authorization", token)
      .send({
        name: "workout",
        frequency: [0, 2, 4],
      });

    expect(response.status).toBe(200);
    expect(response.body.habit.name).toBe("workout");
    await Habit.findByIdAndDelete({ _id: response.body.habit._id });
  });
});
