import * as compression from "koa-compress";
import * as cors from "@koa/cors";
import * as serve from 'koa-static';
import * as koaBody from "koa-body";
import * as mount from 'koa-mount';
import { CustomResponse, IServer } from "../interfaces/ServerInterface";
import { HttpError } from "../error/index";
import { sendHttpErrorModule } from "../error/sendHttpError";
import  TimeMiddleware  from './time.middleware';
import  UsersMiddleware from './user.middleware';
import { Context } from "koa";

/**
 * @export
 * @class Middleware
 */
export default class Middleware {
  /**
   * @static
   * @param {IServer} server
   * @memberof Middleware
   */
  static init(server: IServer): void {
    
    server.app.use(mount('/static', serve(__dirname + '../controllers')));

    // express middleware
    server.app.use(
      koaBody({
        multipart: true,
        formLimit: "5mb",
        formidable: { maxFileSize: 200 * 1024 * 1024 }
      })
    );
    // server.app.use(bodyParser.json());
    // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    // server.app.use(cookieParser());
    // returns the compression middleware
    server.app.use(
      compression({
        filter: function(content_type) {
          return /text/i.test(content_type);
        },
        threshold: 2048,
        flush: require("zlib").Z_SYNC_FLUSH
      })
    );
    // helps you secure your Express apps by setting various HTTP headers
    // server.app.use(helmet());
    // providing a Connect/Express middleware that can be used to enable CORS with various options
    server.app.use(cors());
    // To serve static files such as images, CSS files, and JavaScript files
    // server.app.use(express.static(path.join(__dirname, '../../../client')));
    // render
    // server.app.set('views', path.join(__dirname, '../../../client'));
    // server.app.engine('html', renderFile);
    // server.app.set('view engine', 'ejs');



    // custom errors
    server.app.use(sendHttpErrorModule);

    // my middlewares
    server.app.use(TimeMiddleware.use);

    // cors
    server.app.use(async (ctx, next) => {
        
      ctx.set({
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      });
      ctx.set({
        'Access-Control-Allow-Headers': 
        "Origin, X-Requested-With," +
          " Content-Type, Accept," +
          " Authorization," +
          " Access-Control-Allow-Credentials," +
          " X-Accepted-OAuth-Scopes"
      });
      ctx.set({'Access-Control-Allow-Credentials': 'true'});
      await next();
    });
    
  }

  /**
   * @static
   * @param {IServer} server
   * @memberof Middleware
   */
  static initErrorHandler(server: IServer): void {
    server.app.use(async (ctx: Context, next: Function) => {
      
        await next().catch((error) => {
        if (typeof error === "number") {
          error = new HttpError(error); // next(404)
        }

        if (error instanceof HttpError) {
          ctx.sendHttpError(error);
        } else {
          if (server.app.env === "development") {
            error = new HttpError(500, error.message);
            ctx.sendHttpError(error);
          } else {
            error = new HttpError(500);
            ctx.sendHttpError(error, error.message);
          }
        }

        console.error(error);
      });
    });
  }
}
