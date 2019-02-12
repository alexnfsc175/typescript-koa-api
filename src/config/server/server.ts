// https://github.com/Thavarajan/Mangoose-Typescript-With-Repository-Pattern
// https://github.com/lykmapipo/mongoose-gridfs
import * as Koa from 'koa';
import Routes from '../router/routes';
import Middleware from '../middleware';
import { oauthServer } from '../../helpers/oauthServer';
// import Cron from '../cron/cron';


/**
 * @export
 * @class Server
 */
export class Server {
    // set app to be of type express.Application
    public app: Koa;

    /**
     * Creates an instance of Server.
     * @memberof Server
     */
    constructor() {
        this.app = new Koa();
        this.app.context.oauth = oauthServer;
        // Cron.init();
        Middleware.init(this);
        Middleware.initErrorHandler(this); // Errors do koa são tratado no inicio da cadeia de midlewres
        Routes.init(this);
    }
}

export default new Server().app;
