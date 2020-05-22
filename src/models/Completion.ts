import mongoose from "mongoose";

import { UserType } from "./User";
import { HabitType } from "./Habit";

export interface CompletionType extends mongoose.Document {
  date: Date;
  user: UserType;
  habits: mongoose.Types.Array<HabitType>;
}

export const CompletionSchema = new mongoose.Schema({
  date: {
    default: () => new Date(new Date().toDateString()), // Temporary should be set by the client for proper time zone management
    type: Date,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Habit" }],
});

const Completion = mongoose.model<CompletionType>(
  "Completion",
  CompletionSchema
);
export default Completion;
