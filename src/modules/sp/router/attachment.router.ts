import * as Router from "koa-router";
import AttachmentController from "../controllers/attachment.controller";
/**
 * @export
 * @class AttachmentRouter
 */
class AttachmentRouter {
  public router: Router;

  /**
   * Creates an instance of AttachmentRouter.
   * @memberof AttachmentRouter
   */
  constructor() {
    this.router = new Router();
    this.routes();
  }

  /**
   * @memberof AttachmentRouter
   */
  public routes(): void {
    this.router.get("/:id", AttachmentController.get);
    this.router.delete("/:id", AttachmentController.delete);
    this.router.post("/", AttachmentController.save);
  }
}

export default new AttachmentRouter();
