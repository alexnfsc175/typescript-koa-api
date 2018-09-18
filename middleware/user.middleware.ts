import { Middleware } from '../common/middleware'
import { Context } from 'koa';

class UsersMiddleware extends Middleware {

    constructor() {
        super();
        this.setPrivate();
    }

    async use(ctx: Context, next: Function) {
        // console.log('ctx', ctx);
        console.log('UsersMiddleware');
        return next();
    }
}

export const usersMiddleware = new UsersMiddleware();
