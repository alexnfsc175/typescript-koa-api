import { IServer } from "../interfaces/ServerInterface";
import { oauthServer } from "../../helpers/oauthServer";
import * as mount from "koa-mount";
import UserRouter from "./user.router";
import AccountRouter from "./account.router";
import CustomerRouter from "./customer.router";
import WmsRouter from "./wms.router";
import HolidayRouter from "./holiday.router";
import ReportRouter from "./report.router";
import AttachmentRouter from "./attachment.router";
import InvoiceRouter from "./invoice.router";
import Util from "../../helpers/Util";
import RoleRouter from "./role.router";
import PanelRouter from "./panel.router";

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

    server.app.use(mount("/oauth/token", oauthServer.token()));

    server.app.use(
      mount(
        "/oauth/authorize",
        oauthServer.authorize({
          scope: "admin",
          authorizationCodeLifetime: 60 /*, allowEmptyState: true, */
        })
      )
    );
    // server.app.use(oauthServer.authenticate({scope:'admin'}));

    server.app.use(
      mount("/oauth/callback", (ctx: any, next: Function) => {
        console.log(ctx.query);
        ctx.body = ctx.query;
        ctx.status = 200;
      })
    );


    //TESTE
    // server.app.use(mount("/routers", async (ctx: any, next: Function)=>{
    //   let routes = await Util.getInstance().getExpressRotes({
    //     express: server.app,
    //     except: ['oauth/token']
    // });

    // ctx.body = routes;
    // ctx.status = 200;
    // }));
    //TESTE

    server.app
      .use(mount("/api/v1/users", UserRouter.router.routes()))
      .use(UserRouter.router.allowedMethods())
      .use(mount("/api/v1/accounts", AccountRouter.router.routes()))
      .use(AccountRouter.router.allowedMethods())
      .use(mount("/api/v1/customers", CustomerRouter.router.routes()))
      .use(CustomerRouter.router.allowedMethods())
      .use(mount("/api/v1/wms", WmsRouter.router.routes()))
      .use(WmsRouter.router.allowedMethods())
      .use(mount("/api/v1/holidays", HolidayRouter.router.routes()))
      .use(HolidayRouter.router.allowedMethods())
      .use(mount("/api/v1/reports", ReportRouter.router.routes()))
      .use(ReportRouter.router.allowedMethods())
      .use(mount("/api/v1/attachments", AttachmentRouter.router.routes()))
      .use(AttachmentRouter.router.allowedMethods())
      .use(mount("/api/v1/invoices", InvoiceRouter.router.routes()))
      .use(InvoiceRouter.router.allowedMethods())
      .use(mount("/api/v1/roles", RoleRouter.router.routes()))
      .use(RoleRouter.router.allowedMethods())
      .use(mount("/api/v1/panels", PanelRouter.router.routes()))
      .use(PanelRouter.router.allowedMethods());
  }
}
