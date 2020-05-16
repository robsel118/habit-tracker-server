import Koa from "koa";
import bodyparser from "koa-bodyparser";

import "./lib/env";
import auth from "./auth";
import routes from "./routes";

const app = new Koa();

/** Middlewares */
app.use(bodyparser());

/** Auth services */
app.use(auth());

/** Routes */
app.use(routes());

export default app;
