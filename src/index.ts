import * as Koa from "koa";
import * as Router from "koa-router";

import * as bodyparser from "koa-bodyparser";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import routes from './routes'

const app = new Koa();

dotenv.config();

/** Middlewares */
app.use(bodyparser());

/** Routes */
app.use(routes());




/** Database */
mongoose.connect(process.env.MONGO_URI,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to MongoDB database");
});

mongoose.connection.on("error", (err) => {
  console.log("an error occured when connecting to to the database");
});

app.listen(process.env.PORT, () =>
  console.log(`server started on port ${process.env.PORT}`)
);
