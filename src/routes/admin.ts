import Koa from 'koa'
import Router from "koa-router";

async function getAdminLoginPage(ctx: Koa.Context) {
  return await ctx.render('login.pug')
}

export default (router: Router) => {
  router.get("/login", getAdminLoginPage);
};