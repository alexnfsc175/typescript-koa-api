import { Context } from 'koa';

export default class TimeMiddleware {
    
    constructor() {
    }

    public static async use(ctx: Context, next: Function) {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${ctx.method} ${ctx.originalUrl} - ${ms} ms`)
        ctx.set('X-Powered-By', 'PHP/7.3.2');// fake application!
        ctx.set('X-Response-Time', `${ms}ms`);
    }
}

