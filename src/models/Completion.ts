import mongoose from "mongoose";

import User, { UserType } from "./User";
import Habit, { HabitType } from "./Habit";

export interface CompletionType extends mongoose.Document {
  date: Date;
  userId: UserType;
  habitId: [HabitType];
}

export const CompletionSchema = new mongoose.Schema(
  {
    date: {
      default: () => new Date(new Date().toDateString()), // Should be set by the user for proper time zone management
      type: Date,
    },
    userId: User,
    habitId: [Habit],
  },
  {
    timestamps: {
      createdAt: "createdAt",
    },
  }
);

const Completion = mongoose.model<CompletionType>(
  "Completion",
  CompletionSchema
);
export default Completion;
