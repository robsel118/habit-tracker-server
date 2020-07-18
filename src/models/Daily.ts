import mongoose from "mongoose";
import { HabitType } from "./Habit";
import moment from "moment";
import {
  startOfISOWeek,
  lastDayOfISOWeek,
  eachDayOfInterval,
  startOfDay,
} from "date-fns";
import { reduce, includes } from "ramda";

export enum DailyState {
  NOT_DONE = 0,
  IMPLICITLT_DONE = 1,
  EXPLICITLY_DONE = 2,
}

export interface DailyType extends mongoose.Document {
  value: DailyState;
  date: Date;
  // habit: HabitType;
}

const DailySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: () => startOfDay(new Date()),
  },
  value: {
    type: Number,
    default: 0,
    enum: [0, 1, 2],
  },
});

// DailySchema.methods.toggleHabit = function (habitId: string) {
//   const currentValue = this.habits.get(habitId);

//   this.habits.set(habitId, !currentValue);

//   const completed = reduce(
//     (acc: number, value: boolean) => {
//       if (value) acc++;
//       return acc;
//     },
//     0,
//     this.habits.values()
//   );
//   this.completion = (completed / this.habits.size) * 100;
// };

const Daily = mongoose.model<DailyType>("Daily", DailySchema);
export default Daily;
