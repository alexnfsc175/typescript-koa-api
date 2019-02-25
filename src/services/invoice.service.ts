"use strict";
import LmxSP from "../helpers/LmxSP";
import InvoiceModel, { IInvoice } from "../models/invoice.model";

export default class InvoiceService {
  constructor(parameters) {}

  static async getInvoices() {
    let invoices = await LmxSP.getInstance().getInvoiceEntry();
    let _invoices = await InvoiceModel.find({});
    let found = null;

    for (const invoice of invoices) {
      found = _invoices.find((element, index, array) => {
        return element.number == invoice.numero && element.cnpj == invoice.cnpj;
      });

      let itens = invoice.itens.map(item => ({
        code_prod: item.codigo_prod,
        name_prod: item.nome_prod,
        qtd: item.qtde
      }));

      if (!found) {
        //insere
        await new InvoiceModel({
          number: invoice.numero,
          client: invoice.cliente,
          cnpj: invoice.cnpj,
          project: invoice.projeto,
          social_name: invoice.razao,
          itens: itens
        }).save();
      }
    }

    // Filtrar para o que estão vindo da LMX
    // if (!found) // Se inseriu buscar todos novamente

    const ids = new Set([...invoices].map(({ numero }) => numero));

    _invoices = await InvoiceModel.find({});

    const filtered = _invoices.filter(({ number }) => ids.has(number));

    return filtered;
  }
}
