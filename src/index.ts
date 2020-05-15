import app from "./app";
import dotenv from "dotenv";
import connectDatabase from "./db";

dotenv.config();

connectDatabase(process.env.MONGO_URI);

app.listen(process.env.PORT, () =>
  console.log(`server started on port ${process.env.PORT}`)
);
