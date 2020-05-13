import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import * as Joi from "joi";

export interface TypeUser extends mongoose.Document {
  name: string;
  email: string;
  hash: string;
  setHash?: (string) => void;
}

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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

UserSchema.methods.setHash = function (password: string) {
  bcrypt.hash(password, 10, function (err, hash) {
    this.hash = hash;
  });
};

UserSchema.methods.validatePayload = function (obj: Record<string, string>) {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().required,
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required,
  });

  return schema.validate(obj);
};
const User = mongoose.model<TypeUser>("User", UserSchema);
export default User;
