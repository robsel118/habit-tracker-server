import Router from "koa-router";

import userRoute from "./api/user";
import authRoute from "./api/auth";

const router = new Router({
  prefix: "/api",
});

userRoute(router);
authRoute(router);

export default router;
