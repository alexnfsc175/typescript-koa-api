import { KoaOAuthServer } from '../helpers/koaOauthServer';
import { Context } from 'koa';
import { Middleware } from './middleware';

declare module "koa" {
    /**
     * See https://www.typescriptlang.org/docs/handbook/declaration-merging.html for
     * more on declaration merging
     */
    interface BaseContext {
        oauth: KoaOAuthServer;
        // myOtherProperty: number;
    }
}

// declare function compose<T>(middleware: Array<Middleware>): Middleware;



