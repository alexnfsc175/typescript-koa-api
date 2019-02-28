import * as Router from "koa-router";
import ReportController from "../controllers/report.controller";
/**
 * @export
 * @class ReportRouter
 */
class ReportRouter {
  public router: Router;

  /**
   * Creates an instance of ReportRouter.
   * @memberof ReportRouter
   */
  constructor() {
    this.router = new Router();
    this.routes();
  }

  /**
   * @memberof ReportRouter
   */
  public routes(): void {
    // Reports Routes
this.router.post('/invoice/:invoiceNumber/entry/photo/:photoCode', ReportController.saveEntryPhoto); // upload.single('file')
this.router.post('/invoice/:id/exit/photo/:typePhoto', ReportController.saveExitPhoto); // upload.single('file')
this.router.get('/invoice/:invoiceNumber/entry', ReportController.entryReport);
this.router.get('/invoice/:id/exit', ReportController.exitReport);
this.router.get('/invoice/photos/types', ReportController.photosTypes);
this.router.get('/invoice/breakdowns/types', ReportController.exitReport);
  }
}

export default new ReportRouter();
