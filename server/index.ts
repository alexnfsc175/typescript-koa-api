import * as Koa from 'koa';
import * as Mongoose from 'mongoose';
import { environment } from '../common/environment';
import { Router } from '../common/router';
import { Middleware } from '../common/middleware';
import { AccessModifiers } from '../common/accessModifiers';
import { oauthServer } from '../helpers/oauthServer';
import * as mount from 'koa-mount';
import * as koaBody from 'koa-body';


export class Server {

    application: Koa;
    db: Mongoose.Connection;

    initializeDb(): Promise<any> {
        // (<any>Mongoose).Promise = global.Promise;

        return Mongoose.connect(environment.db.url, environment.db.options)
    }

    async init(routers: Router[], middlewares: Middleware[]): Promise<any> {

        // error TS2693: 'Promise' only refers to a type, but is being used as a value here.
        return new Promise((resolve, reject) => {
            try {

                // this.db = mongoose.createConnection(this.MONGODB_CONNECTION);
                this.application = new Koa();
                this.application.context.oauth = oauthServer;

                this.application.use(koaBody({ multipart: true, formLimit: '5mb', formidable: { maxFileSize: 200 * 1024 * 1024 } }));

                this.application.use(mount('/oauth/token', oauthServer.token()));  

                // Routes Private
                for (const router of routers) {
                    console.log("Route Private: ", router)
                    router.apply(this.application, middlewares);   
                }

                this.application.listen(this.getPort());
                resolve(this.application);

                console.log('FIM');
            } catch (error) {
                console.log('Error: ', error);
                reject(error)
            }
        });
    }
    bootstrap(routers: Router[] = [], middlewares: Middleware[] = []): Promise<Server> {
        return this.initializeDb().then(_ =>
            this.init(routers, middlewares).then(() => this));
    }

    // Generics
    // getPublic<T extends AccessModifiers>(list: T[]) {
    //     return list.filter(item => item.isPublic());
    // }

    // getPrivate<T extends AccessModifiers>(list: T[]) {
    //     return list.filter(item => item.isPrivate());
    // }

    getPort() {
        return environment.server.port;
    }

    // https://github.com/typestack/routing-controllers/blob/master/src/driver/koa/KoaDriver.ts
    registerMiddleware(middleware: Middleware): void {
        if ((middleware as Middleware).use) {
            this.application.use(function (ctx: any, next: any) {
                return (middleware as Middleware).use(ctx, next);
            });
        }
    }

    // registerMiddleware(middleware: MiddlewareMetadata): void {
    //     if ((middleware.instance as KoaMiddlewareInterface).use) {
    //         this.koa.use(function (ctx: any, next: any) {
    //             return (middleware.instance as KoaMiddlewareInterface).use(ctx, next);
    //         });
    //     }

}