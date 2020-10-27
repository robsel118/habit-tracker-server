import Koa from 'koa';

export const BAD_REQUEST = "Bad Request";


export const handleErrors = (fn: Function) => {
  return function (ctx: Koa.Context, next: Koa.Next) {
    return fn(ctx, next).catch(err => {
      ctx.status = err.status || 500;
      ctx.body = err.message;
    });
  }
}
