import * as Koa from 'koa';
import * as Router from "koa-router";

async function getHabits(ctx: Koa.Context, next){
    ctx.body = "this should return the user info"
}

export default (router: Router) => {
    router.get('user/me', getHabits);
}