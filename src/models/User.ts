import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Joi from "joi";
import { isNil } from "ramda";
import { HabitType } from "./Habit";
import { startOfDay } from "date-fns";
import moment from "moment";

export interface UserType extends mongoose.Document {
  username: string;
  email: string;
  hash: string;
  tokenExpiry: Date;
  habitList: [HabitType];
  setHash: (password: string) => string;
  lastConnected: Date;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hash: {
      type: String,
      required: true,
      trim: true,
    },
    tokenExpiry: {
      type: Date,
    },
    habitList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Habit" }],
    lastConnected: {
      type: Date,
      default: startOfDay(moment().toDate()),
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

UserSchema.methods.setHash = async function (password: string) {
  const self = this;
  return bcrypt.hash(password, 10).then((hash) => (self.hash = hash));
};

export function validateNewUserInfo(obj: Record<string, string>) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
    lastConnected: Joi.date(),
  });

  const { error } = schema.validate(obj);

  return isNil(error);
}

const User = mongoose.model<UserType>("User", UserSchema);
export default User;
