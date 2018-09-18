import { Middleware } from '../common/middleware'
import { Context } from 'koa';

class TimeMiddleware extends Middleware {
    constructor() {
        super();
        this.setPublic();
    }
    async use(ctx: Context, next: Function) {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${ms} ms`)
        ctx.set('X-Response-Time', `${ms}ms`);
    }
}

export const timeMiddleware = new TimeMiddleware();
