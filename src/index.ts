import app from "./app";
import connectDatabase from "./db";

connectDatabase(process.env.MONGO_URI);

app.listen(process.env.PORT, () =>
  console.log(`server started on port ${process.env.PORT}`)
);
