// import * as Router from 'koa-router';
import UserRouter from './user.router';
import AccountRouter from './account.router';
import { IServer } from '../interfaces/ServerInterface';
import { oauthServer } from '../../helpers/oauthServer';
import * as mount from 'koa-mount'
import { Context } from 'koa';

// https://github.com/sohamkamani/node-oauth-example/blob/master/index.js

/**
 * @export
 * @class Routes
 */
export default class Routes {
    /**
     * @static
     * @param {IServer} server
     * @memberof Routes
     */
    static init(server: IServer): void {
        // const router: Router = new Router();

        // users
        // router.use(mount('/user', UserRouter.router.routes())); 
        

        // index
        // server.app.use('/', (req, res) => {
        //     res.render('index', {
        //         title: 'Hey',
        //         message: 'Hello there!'
        //     });
        // });

        server.app.use(mount('/oauth/token', oauthServer.token()));  

        server.app.use(mount('/oauth/authorize', oauthServer.authorize({scope:'admin', authorizationCodeLifetime: 60/*, allowEmptyState: true, */})));
        // server.app.use(oauthServer.authenticate({scope:'admin'}));

        server.app.use(mount('/oauth/callback', (ctx: any, next: Function) =>{
            console.log(ctx.query);
            ctx.body = ctx.query;
            ctx.status = 200;
        
        }));

        server.app
            .use(mount('/api/v1/user', UserRouter.router.routes()))
            .use(mount('/api/v1/account', AccountRouter.router.routes()))
            .use(UserRouter.router.allowedMethods()); 
    }
}
