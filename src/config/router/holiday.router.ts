import * as Router from "koa-router";
import HolidayController from "../../controllers/holiday.controller";

/**
 * @export
 * @class HolidayRouter
 */
class HolidayRouter {
  public router: Router;

  /**
   * Creates an instance of HolidayRouter.
   * @memberof HolidayRouter
   */
  constructor() {
    this.router = new Router();
    this.routes();
  }

  /**
   * @memberof HolidayRouter
   */
  public routes(): void {
    // Holidays Routes
    this.router.post("/", HolidayController.save);
    this.router.get("/", HolidayController.all);
    this.router.delete("/:id", HolidayController.delete);
    this.router.put("/:id", HolidayController.update);
    this.router.get("/:start/:end", HolidayController.between);
  }
}

export default new HolidayRouter();
