import mongoose from "mongoose";
import { HabitType } from "./Habit";
import moment from "moment";
import { startOfDay } from "date-fns";
import { reduce } from "ramda";
import { UserType } from "./User";

interface DailyType extends mongoose.Document {
  user: UserType;
  habits: mongoose.Types.Map<boolean>;
  date: Date;
  completion: number;
  setHabits: (habits: Array<HabitType>) => void;
  toggleHabit: (string) => void;
}

const DailySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  habits: {
    type: Map,
    of: Boolean,
  },
  date: {
    type: Date,
    default: () => startOfDay(new Date()),
  },
  completion: {
    type: Number,
    default: 0,
  },
});

DailySchema.methods.setHabits = function (habits: Array<HabitType>) {
  const dayOfWeek = moment(this.date).isoWeekday() - 1;
  this.habits = {};

  habits.forEach((habit) => {
    habit.frequency.forEach((day) => {
      if (day === dayOfWeek) {
        this.habits.set(habit._id.toString(), false);
      }
    });
  });
};

DailySchema.methods.toggleHabit = function (habitId: string) {
  const currentValue = this.habits.get(habitId);

  this.habits.set(habitId, !currentValue);

  const completed = reduce(
    (acc: number, value: boolean) => {
      if (value) acc++;
      return acc;
    },
    0,
    this.habits.values()
  );
  this.completion = (completed / this.habits.size) * 100;
};

const Daily = mongoose.model<DailyType>("Daily", DailySchema);
export default Daily;
