import mongoose from "mongoose";
import Joi from "joi";
import { isNil } from "ramda";

export enum Day {
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
}

export interface HabitType extends mongoose.Document {
  name: string;
  not: boolean;
  frequency: [number];
  currentStreak: number;
}

export const HabitSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    not: {
      type: Boolean,
      default: false,
    },
    frequency: [
      {
        required: true,
        type: [Number],
        enum: [0, 1, 2, 3, 4, 5, 6],
        default: undefined,
      },
    ],
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

export function validateHabitData(obj: Record<string, any>) {
  const schema = Joi.object({
    name: Joi.string().max(20).required(),
    not: Joi.boolean(),
    frequency: Joi.array()
      .items(Joi.number().valid(0, 1, 2, 3, 4, 5, 6))
      .min(1)
      .required(),
  });

  const { error } = schema.validate(obj);

  return isNil(error);
}

const Habit = mongoose.model<HabitType>("Habit", HabitSchema);
export default Habit;
