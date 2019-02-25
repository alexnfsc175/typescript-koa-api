import { Context } from "koa";
import  InvoiceModel  from "../models/invoice.model";
import InvoiceService from "../services/invoice.service";
import LmxSP from "../helpers/LmxSP";

/**
 * @export
 * @class InvoiceController
 */
export default class InvoiceController {
  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof InvoiceController
   */
  static async getInvoices(ctx: Context, next: Function) {
    let invoices = [];
    const { type } = ctx.query;

    if (type != "exit" && type != "entry") {
      ctx.body = {
        message: `Unsupported type: ${type}`
      };
      ctx.status = 404;
    }

    if (type == "entry") invoices = await InvoiceService.getInvoices();

    if (type == "exit") invoices = await InvoiceService.getInvoices();
    // invoices = [{
    //         numero: '1',
    //         cliente: 'RBC GLOBAL'
    //     }, {
    //         numero: '2',
    //         cliente: 'PATRON COMERCIO'
    //     },
    //     {
    //         numero: '3',
    //         cliente: 'OFFICE BRAND'
    //     }
    // ]

    ctx.body = invoices;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof InvoiceController
   */
  static async getInvoice(ctx: Context, next: Function) {
    let invoice;
    const { invoiceNumber } = ctx.params;

    invoice = await InvoiceModel.findOne({
      number: invoiceNumber
    });

    if (!invoice) {
      ctx.body = {
        error: {
          message: `A Fatura com o numero ${invoiceNumber} não exite!`
        }
      };
      ctx.status = 404;
    }

    ctx.body = invoice;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof InvoiceController
   */
  static async getInvoiceBreakdowns(ctx: Context, next: Function) {
    let breakdowns = [];
    const { code } = ctx.query;
    // Caso o Endpoint pare de funcionar
    // breakdowns = [{
    //         codigo: "6",
    //         tipo_avaria: "1-A-1-6"
    //     },
    //     {
    //         codigo: "1",
    //         tipo_avaria: "Aguardando NF de Cobertura"
    //     },
    //     {
    //         codigo: "14",
    //         tipo_avaria: "Amassada / Smashed"
    //     },
    //     {
    //         codigo: "17",
    //         tipo_avaria: "Arranhada/ Fixture Scratched"
    //     },
    //     {
    //         codigo: "2",
    //         tipo_avaria: "AVARIA / Damage"
    //     },
    //     {
    //         codigo: "5",
    //         tipo_avaria: "Canopla Riscada / Scratched canoply"
    //     },
    //     {
    //         codigo: "25",
    //         tipo_avaria: "Cola Aparente / Apparent Glue"
    //     },
    //     {
    //         codigo: "24",
    //         tipo_avaria: "Cupula Descolada / Unglued Canopy"
    //     },
    //     {
    //         codigo: "21",
    //         tipo_avaria: "Falta Cristal / Crystal Lack"
    //     },
    //     {
    //         codigo: "27",
    //         tipo_avaria: "Falta Lampada / Lack Lamp"
    //     },
    //     {
    //         codigo: "19",
    //         tipo_avaria: "Falta Vidro / Without Glass"
    //     },
    //     {
    //         codigo: "15",
    //         tipo_avaria: "Faltando Capa De Vela / Missing Candle Coover"
    //     },
    //     {
    //         codigo: "26",
    //         tipo_avaria: "Manchada / Stained"
    //     },
    //     {
    //         codigo: "20",
    //         tipo_avaria: "Oxidado / Oxidation"
    //     },
    //     {
    //         codigo: "16",
    //         tipo_avaria: "Peça Com Bolhas / Fixture Damaged With Bubbles"
    //     },
    //     {
    //         codigo: "13",
    //         tipo_avaria: "Peça Quebrada / Broken Part"
    //     },
    //     {
    //         codigo: "9",
    //         tipo_avaria: "Peça Torta / Crooked Fixture"
    //     },
    //     {
    //         codigo: "23",
    //         tipo_avaria: "Pintura Canopla Danificada / Painting The Damaged"
    //     },
    //     {
    //         codigo: "11",
    //         tipo_avaria: "Pintura Com Bolhas / Damaged Painting With Bubbles"
    //     },
    //     {
    //         codigo: "4",
    //         tipo_avaria: "Pintura Danificada / Damaged Painting"
    //     },
    //     {
    //         codigo: "12",
    //         tipo_avaria: "Pintura Lascada / Fixture Scratched"
    //     },
    //     {
    //         codigo: "10",
    //         tipo_avaria: "Risco Na Peça / Fixture Scratched"
    //     },
    //     {
    //         codigo: "8",
    //         tipo_avaria: "Sem Cúpula / Missing Shade"
    //     },
    //     {
    //         codigo: "22",
    //         tipo_avaria: "Solda Quebrada / Broken Solder"
    //     },
    //     {
    //         codigo: "3",
    //         tipo_avaria: "SOLICITAÇÃO CLIENTE"
    //     },
    //     {
    //         codigo: "28",
    //         tipo_avaria: "Tomada Fora do Padrão"
    //     },
    //     {
    //         codigo: "18",
    //         tipo_avaria: "Vidro Quebrado-Lascado / Broken Glass"
    //     },

    // ]
    breakdowns = await LmxSP.getInstance().getInvoiceBreakdowns(code);
    ctx.body = breakdowns;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof InvoiceController
   */
  static async updateInvoice(ctx: Context, next: Function) {
    let invoice;
    const { invoiceNumber } = ctx.params;

    const updateData = {};

    InvoiceModel.schema.eachPath(path => {
      if (ctx.request.body.hasOwnProperty(path)) {
        updateData[path] = ctx.request.body[path];
      }
    });

    invoice = await InvoiceModel.findOneAndUpdate(
      { number: invoiceNumber },
      { $set: updateData },
      { new: true }
    );

    ctx.body = invoice;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof InvoiceController
   */
  static async updateInvoiceItem(ctx: Context, next: Function) {
    let invoice;
    const { invoiceNumber, itemId } = ctx.params;

    const { code_prod, name_prod, qtd, lack, leftover } = ctx.request.body;


    invoice = await InvoiceModel.findOneAndUpdate(
      { number: invoiceNumber, "itens._id": itemId },
      {
        $set: {
          "itens.$.code_prod": code_prod,
          "itens.$.name_prod": name_prod,
          "itens.$.qtd": qtd,
          "itens.$.lack": lack,
          "itens.$.leftover": leftover
          // "itens.$": { _id: itemId, code_prod, name_prod, qtd, lack, leftover } // Assim altera o id tambem
        }
      },
      { new: true }
    );

    let item = invoice.itens.find(item => {
      return item.id == itemId;
    });

    ctx.body = item;
    ctx.status = 200;
  }
}
