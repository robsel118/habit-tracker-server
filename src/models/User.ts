import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Joi from "joi";

export interface TypeUser extends mongoose.Document {
  username: string;
  email: string;
  hash: string;
  setHash: (password: string) => string;
}

export const UserSchema = new mongoose.Schema(
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
  // TODO define password complexity
  const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
  });

  const { error } = schema.validate(obj);

  return error == null ? true : false;
}

const User = mongoose.model<TypeUser>("User", UserSchema);
export default User;
