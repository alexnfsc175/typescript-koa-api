import { Context } from "koa";
import { resolve } from "path";
import { readFileSync } from "fs";

export interface IOptions {
  maxAge: number;
}

export default class FaviconMiddleware {
  public static  config(path?: string, options?: IOptions):(ctx: Context, next: Function) => any {
    if (!path ) {  
      return (ctx: Context, next: Function) => {
        if ("/favicon.ico" != ctx.path) {
          return next();
        }
      };
    }
    path = resolve(path);
    options = options || { maxAge: null};

    let icon;
    const maxAge =
      options.maxAge == null
        ? 86400000
        : Math.min(Math.max(0, options.maxAge), 31556926000);
    const cacheControl = `public, max-age=${(maxAge / 1000) | 0}`;

    return (ctx: Context, next: Function) => {
      if ("/favicon.ico" != ctx.path) {
        return next();
      }

      if ("GET" !== ctx.method && "HEAD" !== ctx.method) {
        ctx.status = "OPTIONS" == ctx.method ? 200 : 405;
        ctx.set("Allow", "GET, HEAD, OPTIONS");
      } else {
        // lazily read the icon
        if (!icon) icon = readFileSync(path);
        ctx.set("Cache-Control", cacheControl);
        ctx.type = "image/x-icon";
        ctx.body = icon;
      }
    };
  }
}
