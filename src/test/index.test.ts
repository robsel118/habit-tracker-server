import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app";
import connectDatabase from "../db";
import modelTest from "./models";
import authAPITest from "./api/auth";
import habitAPITest from "./api/habit";
import userAPITest from "./api/user";
const request = supertest.agent(app.callback());
import User from "models/User";
import Habit from "models/Habit";
import Completion from "models/Completion";

describe("Routes", () => {
  beforeAll(async () => {
    await connectDatabase(process.env.MONGO_URI);
    await User.remove({ email: "mock-up@tests.com" });
    await Completion.remove({ "habit.name": "booze" });
    await Habit.remove({ name: "booze" });
  });

  modelTest();
  authAPITest(request);
  habitAPITest(request);
  userAPITest(request);

  afterAll((done) => {
    mongoose.disconnect();
    mongoose.connection.close(done);
  });
});
