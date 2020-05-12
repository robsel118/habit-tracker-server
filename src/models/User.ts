import * as mongoose from "mongoose";


interface IUser extends mongoose.Document {
  name: string;
  email: string;
  hash: string;
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


const User = mongoose.model<IUser>('User', UserSchema);
export default User;