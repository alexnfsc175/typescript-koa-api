import * as Router from "koa-router";
import { PanelController } from "../controllers/panel.controller";
/**
 * @export
 * @class PanelRouter
 */
class PanelRouter {
  public router: Router;

  /**
   * Creates an instance of PanelRouter.
   * @memberof PanelRouter
   */
  constructor() {
    this.router = new Router();
    this.routes();
  }

  /**
   * @memberof PanelRouter
   */
  public routes(): void {
    // Constumer Panel Routes
    this.router.get("/customer", PanelController.all);
    this.router.post("/customer", PanelController.save);
    this.router.get("/:id/customer", PanelController.get);
    this.router.put("/:id/customer", PanelController.update);
    this.router.get("/:id/customer/data", PanelController.customerData);
    this.router.get("/available/customers", PanelController.availableCustomers);

    // Internal Panel Routes
    this.router.get("/internal/data", PanelController.internalData);
    // Operational Panel Routes
    this.router.get("/operational/data", PanelController.operationalData);
  }
}

export default new PanelRouter();
