import app from "./app";
import connectDatabase from "./db";
import Habit from "./models/Habit";
import Daily from "./models/Daily";
const DB_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit_tracker";
const PORT = process.env.PORT || 3000;
import ObjectId from "mongoose";
import { includes } from "ramda";
import {
  startOfISOWeek,
  lastDayOfISOWeek,
  eachDayOfInterval,
  startOfDay,
} from "date-fns";
import moment from "moment";
connectDatabase(DB_URI);

(async () => {
  // const habit = new Habit({
  //   name: "new variant",
  //   not: false,
  //   frequency: [0, 1],
  // });
  // await habit.buildWeeklyHabit();
  // await habit.save();
  // const habitList = await Habit.findById(habit._id).populate({
  //   path: "dailyList",
  //   match: {
  //     date: {
  //       $gte: startOfDay(startOfISOWeek(moment().toDate())),
  //       $lte: startOfDay(startOfDay(moment("2020-07-14").toDate())),
  //     },
  //   },
  //   select: "value date",
  //   model: "Daily",
  // });
})();
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
