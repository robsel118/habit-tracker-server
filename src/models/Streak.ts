import mongoose from "mongoose";
import { HabitType } from "./Habit";
import { differenceInDays } from "date-fns";

export interface StreakType extends mongoose.Document {
  startDate: Date;
  endDate: Date;
  habit: HabitType;
}

export const StreakSchema = new mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
});

StreakSchema.methods.getLength = function () {
  return differenceInDays(this.start, this.end);
};

const Streak = mongoose.model<StreakType>("Streak", StreakSchema);
export default Streak;
