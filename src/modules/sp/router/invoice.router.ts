import * as Router from "koa-router";
import InvoiceController from "../controllers/invoice.controller";

/**
 * @export
 * @class InvoiceRouter
 */
class InvoiceRouter {
  public router: Router;

  /**
   * Creates an instance of InvoiceRouter.
   * @memberof InvoiceRouter
   */
  constructor() {
    this.router = new Router();
    this.routes();
  }

  /**
   * @memberof InvoiceRouter
   */
  public routes(): void {
    //Invoices Routes
    this.router.get('/breakdowns', InvoiceController.getInvoiceBreakdowns);
    this.router.get('/:invoiceNumber', InvoiceController.getInvoice);
    this.router.put('/:invoiceNumber',InvoiceController.updateInvoice);
    this.router.put('/:invoiceNumber/item/:itemId',InvoiceController.updateInvoiceItem);
    this.router.get('', InvoiceController.getInvoices);

  }
}

export default new InvoiceRouter();
