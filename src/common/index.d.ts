import { KoaOAuthServer } from "../helpers/koaOauthServer";
import { BaseContext, BaseState } from "koa";
import * as KoaRouter from "koa-router";

declare module "koa" {
  /**
   * See https://www.typescriptlang.org/docs/handbook/declaration-merging.html for
   * more on declaration merging
   */
  interface BaseContext {
    oauth: KoaOAuthServer;
    // router: KoaRouter;
    // myOtherProperty: number;
  }

  interface BaseState {
    oauth: any;
  }
}

// declare function compose<T>(middleware: Array<Middleware>): Middleware;
