import Router from "koa-router";
import compose from "koa-compose";

import authServices from "./api/auth";
import userServices from "./api/user";
import habitServices from "./api/habit";
import completionServices from "./api/completion";
const router = new Router({
  prefix: "/api",
});

authServices(router);
userServices(router);
habitServices(router);
completionServices(router);

export default () => compose([router.routes(), router.allowedMethods()]);
