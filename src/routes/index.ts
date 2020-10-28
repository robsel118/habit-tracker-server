import Router from "koa-router";
import compose from "koa-compose";
import koaSwagger from "koa2-swagger-ui";
import spec from "../swagger";
import authServices from "./api/auth";
import habitServices from "./api/habit";
import adminServices from "./admin";

const router = new Router({
  prefix: "/api",
});

const adminRouter = new Router({
  prefix: "/admin",
});

router.get(
  "/docs",
  koaSwagger({ routePrefix: false, swaggerOptions: { spec } })
);

authServices(router);
habitServices(router);
adminServices(adminRouter);

export default () =>
  compose([
    router.routes(),
    router.allowedMethods(),
    adminRouter.routes(),
    adminRouter.allowedMethods()
  ]);
