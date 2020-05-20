import mongoose from "mongoose";
import Joi from "joi";

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
    currentStreak: Joi.number().integer(),
  });

  const { error } = schema.validate(obj);
  //   console.log(error);
  return error == null ? true : false;
}

const Habit = mongoose.model<HabitType>("Habit", HabitSchema);
export default Habit;
