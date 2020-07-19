import mongoose from "mongoose";

export interface StreakType extends mongoose.Document {
  startDate: Date;
  endDate: Date;
}

export const StreakSchema = new mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
});

const Streak = mongoose.model<StreakType>("Streak", StreakSchema);
export default Streak;
