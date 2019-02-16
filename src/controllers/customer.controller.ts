"use strict";

import { Context } from "koa";
import { CustomerModel, ICustomer } from "../models/customer.model";
import { AccountModel, IAccount } from "../models/account.model";
import LmxSP from "../helpers/LmxSP";
import { UserModel, IUser } from "../models/user.model";
import { QueryParameters } from "./query-parameters";

export default class CustomerController {
  static async getActive(ctx: Context, next: Function) {
    //   ctx.body = await LmxSP.getInstance().getClients();
    //   ctx.status = 200;
    console.log(
      "query",
      QueryParameters.selectCheck(ctx.query.select, CustomerModel.schema)
    );

    let clients = <ICustomer[]>await CustomerModel.find({}).populate({
      path: "account",
      match: {
        active: true
      },
      select: "-password -permissions" //Não traz esses dois campos
    });

    clients = clients.filter(cli => {
      return cli.account != null;
    });
    ctx.body = clients;
    ctx.status = 200;
  }
  static async getRemote(ctx: Context, next: Function) {
    let clients = await LmxSP.getInstance().getClients();
    ctx.body = clients;
    ctx.status = 200;
  }
  static async getId(ctx: Context, next: Function) {
    let client = await CustomerModel.findOne({
      _id: ctx.params.id
    }).populate("user", {
      password: 0
    });
    ctx.body = client;
    ctx.status = 200;
  }
  static async getAll(ctx: Context, next: Function) {
    let clients = await CustomerModel.find({})
      .populate({
        path: "user",
        select: "-password -permissions" //Não traz esses dois campos
      })
      .lean();

    ctx.body = clients;
    ctx.status = 200;
  }
  static async update(ctx: Context, next: Function) {
    let params = ctx.request.body;
    let user = await UserModel.findById({
      _id: params.user._id
    });

    if (!user) {
      ctx.body = {
        status: 404,
        name: "Error",
        message: "O Usuario não existe!!!"
      };
      ctx.status = 404;
    }

    if (params.user.password) {
      params.user.password = UserModel.schema.methods.generateHash(
        params.user.password
      );
    }

    let insertU = await UserModel.findOneAndUpdate(
      {
        _id: params.user._id
      },
      params.user
    );

    if (!insertU) {
      ctx.body = {
        status: 404,
        name: "Error",
        message: "Não foi possivel iserir o usuario!!!"
      };
      ctx.status = 404;
    }

    params.user = insertU;
    let insertC = await CustomerModel.findOneAndUpdate(
      {
        user: params.user
      },
      params
    );

    if (!insertC) {
      ctx.body = {
        status: 404,
        name: "Error",
        message: "Não foi possivel atualizar o cliente!!!"
      };
      ctx.status = 404;
    }

    ctx.body = insertC;
    ctx.status = 201;
  }
  static async save(ctx: Context, next: Function) {
    let client,
      params = ctx.request.body;
    if (params.user) {
      params.user.password = UserModel.schema.methods.generateHash(
        params.user.password
      );
      params.user.permissions = [
        {
          type: "client",
          roles: ["read"]
        }
      ];
      params.user = await UserModel.create(params.user);
    }
    if (params.user) {
      client = await CustomerModel.create(params);
    }
    ctx.body = client;
    ctx.status = 201;
  }

  static async allRemote(ctx: Context, next: Function) {
    let clients = await LmxSP.getInstance().getClients();
    ctx.body = clients;
    ctx.status = 200;
  }
}
