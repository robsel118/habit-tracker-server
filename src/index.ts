import next from "next";
import server from "./server";
import connectDatabase from "./db";

const DB_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/habit_tracker";
const PORT = process.env.PORT || 3000;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

app.prepare().then(() => {
  connectDatabase(DB_URI);

  server.listen(PORT, () => console.log(`server started on port ${PORT}`));
});
