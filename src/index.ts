import app from "./app";
import connectDatabase from "./db";
const DB_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit_tracker";
const PORT = process.env.PORT || 3000;

connectDatabase(DB_URI);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
