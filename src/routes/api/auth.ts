import * as Koa from 'koa';
import * as Router from "koa-router";


async function signUpUser(ctx: Koa.Context, next: () => Promise<any>){
    ctx.body = "this path is used to sign up a new user"
}

async function signInUser(ctx: Koa.Context, next: () => Promise<any>){
    ctx.body = "this path is used to sign in a registered user"
}


export default (router: Router) => {
    router.get('/auth/register', signUpUser);
    router.get('/auth', signInUser)
}
