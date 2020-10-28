import Koa from "koa";
import bodyparser from "koa-bodyparser";
import views from 'koa-views';

import "./lib/env";
import auth from "./auth";
import routes from "./routes";

const render = views(__dirname + '/views', { extension: 'pug' });

const app = new Koa();

/** Middlewares */
app.use(bodyparser());

/** Auth services */
app.use(auth());

/** Template rendering service */
app.use(render);

/** Routes */
app.use(routes());

export default app;