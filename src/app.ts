import Koa from "koa";

import bodyparser from "koa-bodyparser";
import dotenv from "dotenv";
import auth from "./auth";
import router from "./routes";

const app = new Koa();

dotenv.config();

/** Middlewares */
app.use(bodyparser());

/** Auth services */
app.use(auth());

/** Routes */
app.use(router.routes());

export default app;
