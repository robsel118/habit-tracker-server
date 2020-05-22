import User, { validateNewUserInfo } from "models/User";
import Habit, { validateHabitData, Day } from "models/Habit";
import Completion from "models/Completion";

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
      const testUser = new User({
        username: "robert",
        email: "robert@robert.com",
        password: "password",
      });
      const testHabit = new Habit({
        name: "Eat Junkt",
        frequency: [Day.MONDAY, Day.WEDNESDAY],
      });
      testUser.habits.push(testHabit);

      const completion = new Completion({ user: testUser });
      completion.habits.push(testHabit);

      expect(completion.user._id).toBe(testUser._id);
      expect(completion.habits[0]._id).toBe(testHabit._id);
    });
  });
};
