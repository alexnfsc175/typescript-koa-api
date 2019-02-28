import * as Router from "koa-router";
import CustomerController from "../controllers/customer.controller";
/**
 * @export
 * @class CustomerRouter
 */
class CustomerRouter {
  public router: Router;

  /**
   * Creates an instance of CustomerRouter.
   * @memberof CustomerRouter
   */
  constructor() {
    this.router = new Router();
    this.routes();
  }

  /**
   * @memberof CustomerRouter
   */
  public routes(): void {
    this.router.post("/", CustomerController.save);
    this.router.get("/", CustomerController.getAll);
    this.router.put("/", CustomerController.update);
    this.router.get("/active", CustomerController.getActive);
    this.router.get("/:id", CustomerController.getId);
  }
}

export default new CustomerRouter();
