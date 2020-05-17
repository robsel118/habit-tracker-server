import mongoose from "mongoose";

export enum Day {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export interface HabitType extends mongoose.Document {
  name: string;
  not: boolean;
  frequency: [Day];
  currentStreak: number;
}

const HabitSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    not: {
      type: Boolean,
      default: false,
    },
    frequency: {
      required: true,
      type: [Day],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Habit = mongoose.model<HabitType>("Habit", HabitSchema);
export default Habit;
