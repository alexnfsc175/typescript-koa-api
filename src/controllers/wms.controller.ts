"use strict";

import { Context } from "koa";
import LmxSP from "../helpers/LmxSP";

export default class WmsController {
  static async getCustomer(ctx: Context, next: Function) {
    let clients = await LmxSP.getInstance().getClients();
    // clients = clients.map(c => ({
    //   codigo: parseInt(c.codigo, 10),
    //   nome: c.nome
    // }));
    ctx.body = clients;
    ctx.status = 200;
  }
}
