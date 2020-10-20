import mongoose from "mongoose";
import { startOfDay } from "date-fns";
import { HabitType } from "./Habit";

export enum DailyState {
  NOT_DONE = 0,
  IMPLICITLY_DONE = 1, // task done as no completion is expected
  EXPLICITLY_DONE = 2,
}

export interface DailyType extends mongoose.Document {
  value: DailyState;
  date: Date;
  habit: HabitType;
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
  habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
});

const Daily = mongoose.model<DailyType>("Daily", DailySchema);
export default Daily;
