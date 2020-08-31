import mongoose from "mongoose";
import Joi from "joi";
import { isNil } from "ramda";
import Daily from "./Daily";
import moment from "moment";
import { startOfDay, eachDayOfInterval } from "date-fns";
import { includes } from "ramda";

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
  buildDailys: () => void;
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
    name: Joi.string().max(30).required(),
    not: Joi.boolean(),
    frequency: Joi.array()
      .items(Joi.number().valid(0, 1, 2, 3, 4, 5, 6))
      .min(1)
      .required(),
  });

  const { error } = schema.validate(obj);

  return isNil(error);
}
HabitSchema.methods.buildDailys = function (start: Date, end: Date) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const habit = this;
  const days = eachDayOfInterval({
    start: startOfDay(start),
    end: startOfDay(end),
  });

  const dailyList = [];
  days.forEach((day, index) => {
    const value = includes(index, habit.frequency) ? 0 : 1;
    const daily = new Daily({
      habit: habit,
      date: day,
      value: value,
    });

    dailyList.push(daily);
  });
  return dailyList;
};

const Habit = mongoose.model<HabitType>("Habit", HabitSchema);
export default Habit;
