import { Context } from 'koa';

export default class TimeMiddleware {
    
    constructor() {
    }

    public static async use(ctx: Context, next: Function) {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${ctx.method} ${ctx.originalUrl} - ${ms} ms`)
        ctx.set('X-Response-Time', `${ms}ms`);
    }
}

