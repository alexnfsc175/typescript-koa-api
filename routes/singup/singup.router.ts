import { Router } from '../../common/router';
import * as Koa from 'koa';
import { singUpController } from './singup.controller'
import { Middleware } from '../../common/middleware';

class SingUpRouter extends Router {

    apply(application: Koa, middlewares: Array<Middleware>) {

        // define this router public
        this.setPublic();

        // Routes
        /* Sing Up */
        this.router.post('/signup', singUpController.store);

        this.mountRoutes(application, middlewares);
    }
}

export const singUpRouter = new SingUpRouter();