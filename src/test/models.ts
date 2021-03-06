import User, { validateNewUserInfo } from "models/User";
import Habit, { validateHabitData, Day } from "models/Habit";

export default () => {
  describe("testing mongoose model", () => {
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

      const testUser = new User({
        username: "robert",
        email: "robert@robert.com",
        password: "password",
      });
      const habit = new Habit({ ...payload });
      testUser.habitList.push(habit);

      expect(validateHabitData(payload)).toBe(true);
      expect(habit.name).toBe(payload.name);
      expect(habit.not);
      expect(habit.frequency.length).toBe(1);
      expect(testUser.habitList.length).toBe(1);
      expect(testUser.habitList[0]._id).toBe(habit._id);
    });
    it("creates a habit and builds its dailys", async () => {
      const payload = {
        name: "Eat Junkt",
        frequency: [Day.MONDAY],
        not: true,
      };

      const habit = new Habit({ ...payload });
      const dailyList = habit.buildDailys(
        new Date(2020, 8, 21),
        new Date(2020, 8, 27)
      );
      expect(dailyList.length).toBe(7);
    });
  });
};
