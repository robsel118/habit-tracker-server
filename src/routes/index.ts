import Router from "koa-router";
import compose from "koa-compose";

import authServices from "./api/auth";
import userServices from "./api/user";

const router = new Router({
  prefix: "/api",
});

authServices(router);
userServices(router);

export default () => compose([router.routes(), router.allowedMethods()]);
