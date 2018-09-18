import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as compose from 'koa-compose';
import { AccessModifiers } from './accessModifiers'
import * as mount from 'koa-mount';
import { Context } from 'koa';
import { Middleware } from './middleware';

export abstract class Router extends AccessModifiers {
    router: KoaRouter;
    middlewares: Array<Middleware>;
    scope: String;

    abstract apply(application: Koa, middlewares: Array<Middleware>)
    constructor() {
        super();
        this.router = new KoaRouter();
    }
    async mountRoutes(application: Koa, middlewares: Array<Middleware>) {
        let oauth = application.context.oauth;
        let privateMiddlewares;

        try {

            let _publicMiddlewares = Middleware.getPublic(middlewares).map(middleware => this.parseMiddleware(middleware));
            let _privateMiddlewares = Middleware.getPrivate(middlewares).map(middleware => this.parseMiddleware(middleware))

            if (this.isPublic()) {

                await application.use(compose(_publicMiddlewares)).use(mount(this.router.routes()));
            } else if (this.isPrivate()) {
                if (this.scope) {
                    _privateMiddlewares = [oauth.authenticate({ scope: this.scope }), ..._privateMiddlewares];
                }
                console.log('m', _publicMiddlewares);
                await application.use(compose(_publicMiddlewares)).use(compose(_privateMiddlewares)).use(mount(this.router.routes()));
            }
        } catch (error) {
            console.log(error); 
        }
    }

    parseMiddleware(middleware: Middleware): any {
        if ((middleware as Middleware).use) {
            return (middleware as Middleware).use;
        }
    }

    static getPublic(list: Array<Router>) {
        return list.filter(item => item.isPublic());
    }

    static getPrivate(list: Array<Router>) {
        return list.filter(item => item.isPrivate());
    }


}