import { Context } from 'koa';

export default class UsersMiddleware  {

    constructor() {
    }

    async use(ctx: Context, next: Function) {
        // console.log('ctx', ctx);
        console.log('UsersMiddleware');
        return next();
    }
}
