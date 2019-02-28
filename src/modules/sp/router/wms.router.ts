import * as Router from "koa-router";
import WmsController from "../controllers/wms.controller";
/**
 * @export
 * @class WmsRouter
 */
class WmsRouter {
  public router: Router;

  /**
   * Creates an instance of WmsRouter.
   * @memberof WmsRouter
   */
  constructor() {
    this.router = new Router();
    this.routes();
  }

  /**
   * @memberof WmsRouter
   */
  public routes(): void {
    this.router.get("/customers", WmsController.getCustomer);
  }
}

export default new WmsRouter();
