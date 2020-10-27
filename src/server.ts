import Koa from "koa";
import bodyparser from "koa-bodyparser";

import "./lib/env";
import auth from "./auth";
import routes from "./routes";

const server = new Koa();


/** Middlewares */
server.use(bodyparser());

/** Auth services */
server.use(auth());

/** Routes */
server.use(routes());

export default server;
