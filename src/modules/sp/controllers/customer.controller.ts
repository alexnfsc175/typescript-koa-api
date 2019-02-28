"use strict";

import { Context } from "koa";
import CustomerModel, { ICustomer } from "../models/customer.model";
import AccountModel, { IAccount } from "../models/account.model";
import LmxSP from '../wms/LmxSP';
import UserModel, { IUser } from "../models/user.model";
import { QueryParameters } from "./query-parameters";
import RoleModel from "../models/role.model";

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
  static async getId(ctx: Context, next: Function) {
    let client = await CustomerModel.findOne({
      _id: ctx.params.id
    }).populate("account", {
      password: 0
    });
    ctx.body = client;
    ctx.status = 200;
  }
  static async getAll(ctx: Context, next: Function) {
    let clients = await CustomerModel.find({})
      .populate({
        path: "account",
        select: "-password -permissions" //Não traz esses dois campos
      })
      .lean();

    ctx.body = clients;
    ctx.status = 200;
  }
  static async update(ctx: Context, next: Function) {
    const { account, deliveryTime, name, code, logo } = ctx.request.body;

    if (account && account.password) {
      account.password = AccountModel.schema.methods.generateHash(
        account.password
      );
    }

    let updateData: any = { deliveryTime, name, code }

    if(logo){
      updateData = {...updateData, logo};
    }

    let acc = await AccountModel.findOneAndUpdate(
      {
        _id: account._id
      },
      account,
      { new: true }
    );

    let customer = await CustomerModel.findOneAndUpdate(
      {
        account: acc._id
      },
      updateData,
      { new: true }
    );

    // let insertU = await UserModel.findOneAndUpdate(
    //   {
    //     _id: params.user._id
    //   },
    //   params.user
    // );

    // if (!insertU) {
    //   ctx.body = {
    //     status: 404,
    //     name: "Error",
    //     message: "Não foi possivel iserir o usuario!!!"
    //   };
    //   ctx.status = 404;
    // }

    // params.user = insertU;
    // let insertC = await CustomerModel.findOneAndUpdate(
    //   {
    //     user: params.user
    //   },
    //   params
    // );

    // if (!insertC) {
    //   ctx.body = {
    //     status: 404,
    //     name: "Error",
    //     message: "Não foi possivel atualizar o cliente!!!"
    //   };
    //   ctx.status = 404;
    // }

    ctx.body = customer;
    ctx.status = 200;
  }
  static async save(ctx: Context, next: Function) {
    // let client,
    //   params = ctx.request.body;
    const { account, code, deliveryTime, name, logo } = ctx.request.body;

    // account.password = AccountModel.schema.methods.generateHash(
    //   account.password
    // );

    let role = await RoleModel.findOne({ name: "customer" });
    account.role = role.id;
    let accountCreated = await AccountModel.create({
      active: account.active,
      email: account.email,
      password: account.password,
      role: role.id
    });

    let customer = await CustomerModel.create({
      code,
      deliveryTime,
      name,
      logo,
      account: accountCreated.id
    });

    ctx.body = customer;
    ctx.status = 201;
  }
  // static async allRemote(ctx: Context, next: Function) {
  //   let clients = await LmxSP.getInstance().getClients();
  //   ctx.body = clients;
  //   ctx.status = 200;
  // }

  // static async getRemote(ctx: Context, next: Function) {
  //   let clients = await LmxSP.getInstance().getClients();
  //   ctx.body = clients;
  //   ctx.status = 200;
  // }
}
