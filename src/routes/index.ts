import * as Router from "koa-router";
import * as compose from "koa-compose";
import importDir from "import-dir";


export default function routes() {
  const Routes = importDir(`./api`);
  const router = new Router({
    prefix: "/api",
  });

  Object.keys(Routes).map((name) => Routes[name](router));

  return compose([router.routes(), router.allowedMethods()]);
}
