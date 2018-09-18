import { Router } from '../../common/router';
import * as Koa from 'koa';
import { usersController } from './users.controller'
import { Middleware } from '../../common/middleware';

class UsersRouter extends Router {

    scope = 'admin';

    async apply(application: Koa, middlewares: Array<Middleware>) {
        let oauth = application.context.oauth;
        // define this router public
        this.setPrivate();

        // Routes
        // [
        //     method: 'get',
        //     route: '/users',
        //     action: usersController.index
        // ]
        this.router.get('/users', oauth.scope('edit'), usersController.index)
        this.router.get('/users/:id', usersController.show)

        await this.mountRoutes(application, middlewares);
    }
}

export const usersRouter = new UsersRouter();