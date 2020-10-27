import supertest from "supertest";
import mongoose from "mongoose";
import app from "../server";
import connectDatabase from "../db";
import modelTest from "./models";
import authAPITest from "./api/auth";
import habitAPITest from "./api/habit";
import User from "models/User";
import Habit from "models/Habit";
const request = supertest.agent(app.callback());

describe("Routes", () => {
  beforeAll(async () => {
    await connectDatabase(process.env.MONGO_URI);
    await User.remove({ email: "mock-up@tests.com" });
    await Habit.remove({ name: "booze" });
  });

  modelTest();
  authAPITest(request);
  habitAPITest(request);

  afterAll((done) => {
    mongoose.disconnect();
    mongoose.connection.close(done);
  });
});
