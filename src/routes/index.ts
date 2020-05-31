import Router from "koa-router";
import compose from "koa-compose";
import koaSwagger from "koa2-swagger-ui";
import spec from "../swagger";
import authServices from "./api/auth";
import userServices from "./api/user";
import habitServices from "./api/habit";

const router = new Router({
  prefix: "/api",
});

router.get(
  "/docs",
  koaSwagger({ routePrefix: false, swaggerOptions: { spec } })
);

authServices(router);
userServices(router);
habitServices(router);

export default () => compose([router.routes(), router.allowedMethods()]);
