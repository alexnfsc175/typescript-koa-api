"use strict";
import * as moment from 'moment-timezone';
import { Context } from "koa";
import { PanelModel, IPanel } from "../models/panel.model";
import { CustomerModel } from "../models/customer.model";
import LmxSP from "../helpers/LmxSP";
import Util from "../helpers/Util";

export class PanelController {
  static async all(ctx: Context, next: Function) {
    let panels = await PanelModel.find({}).populate([
      {
        path: "clients",
        populate: {
          path: "user",
          select: "-password -permissions" //Não traz esses dois campos
        }
      },
      {
        path: "user",
        select: "-password -permissions" //Não traz esses dois campos
      }
    ]);

    ctx.body = panels;
    ctx.status = 200;
  }

  static async get(ctx: Context, next: Function) {
    let id = ctx.params.id;
    let panel = await PanelModel.findOne({
      _id: id
    }).populate([
      {
        path: "clients",
        populate: {
          path: "user",
          select: "-password -permissions" //Não traz esses dois campos
        }
      },
      {
        path: "user",
        select: "-password -permissions" //Não traz esses dois campos
      }
    ]);
    ctx.body = panel;
    ctx.status = 200;
  }

  static async update(ctx: Context, next: Function) {
    let params = ctx.request.body;
    let panel = await PanelModel.findById({
      _id: params._id
    });

    if (!panel) {
      ctx.body = {
        // TODO: PARADRAO DE ERRORS
      };
      ctx.status = 400;
    }

    let insert = await PanelModel.findOneAndUpdate(
      {
        _id: params._id
      },
      params
    );

    ctx.body = insert;
    ctx.status = 200;
  }

  static async save(ctx: Context, next: Function) {
    let params = ctx.request.body;
    let panel = await PanelModel.create(params);
    ctx.body = panel;
    ctx.status = 200;
  }

  static async availableCustomers(ctx: Context, next: Function) {
    let panels = await PanelModel.find({});

    let arrayClis = [];
    for (let p of panels) {
      for (let c of p.customers) arrayClis.push(c);
    }

    let clients = await CustomerModel.find({
      _id: {
        $nin: arrayClis
      }
    })
      .populate({
        path: "user",
        match: {
          active: true
        },
        select: "-password -permissions" //Não traz esses dois campos
      })
      .lean();

    clients = clients.filter(cli => {
      return cli.user != null;
    });

    ctx.body = clients;
    ctx.status = 200;
  }

  static async customerData(ctx: Context, next: Function) {
    let id = ctx.params.id;
    let panel = await PanelModel.findOne({
      _id: id
    })
      .populate([
        {
          path: "clients",
          populate: {
            path: "user",
            select: "-password -permissions" //Não traz esses dois campos
          }
        },
        {
          path: "user",
          select: "-password -permissions" //Não traz esses dois campos
        }
      ])
      .lean();

    let orders = await LmxSP.getInstance().getOrders(panel.clients);

    let data: any = {};
    data.logo = panel.urlLogo;
    if (orders.length) {
      data.orders = orders.filter(order => {
        return (
          ["ABERTO", "SOLICITADO", "CONFERENCIA"].indexOf(order.status) > -1
        );
      });
      data.orders = data.orders.sort(function(a, b) {
        return a.criacao - b.criacao;
      });

      data.removals = orders.filter(order => {
        return ["EXPEDIDO/AGUARD. RETIRA"].indexOf(order.status) > -1;
      });
    }
    ctx.body = data;
    ctx.status = 200;
  }

  //   Internal panel
  static async internalData(ctx: Context, next: Function) {
    let customers = await CustomerModel.find().populate({
      path: "account",
      match: {
        active: true
      }
    });

    // parace ser desnecessaria
    // customers = customers.filter(customers => {
    //     return customers.account != null;
    // });

    let orders = await LmxSP.getInstance().getAllOrders(customers);
    let data: any = {};
    let date = moment();

    if (orders && orders.length) {
      // Waiting for Separation
      // À espera de separação
      data.waitingSeparation = orders.filter(order => {
        return (
          ["ABERTO", "SOLICITADO", "CONFERENCIA"].indexOf(order.status) > -1
        );
      });

      orders = orders.filter(order => {
        return (
          order.confirmacao &&
          order.confirmacao.year() == date.year() &&
          order.confirmacao.month() == date.month()
        );
        // return order.criacao.year() == date.year() && (order.criacao.month() == date.month() || order.confirmacao && order.confirmacao.year() == date.year() && order.confirmacao.month() == date.month());
      });

      // Total de pedidos Separados no Mês
      data.separatedInMonth = orders;

      // Percentage of separation in the Time
      // Porcentagem de separação no tempo
      data.separatedInTime = data.separatedInMonth.filter(order => {
        // se a data de confirmação ocorreu 48 depois da criação
        let d = order.criacao.clone();

        // Se for sabado ou domingo add 1 dia
        while (d.isoWeekday() == 6 || d.isoWeekday() == 7) {
          d.add(1, "days");
        }

        d.add(order.codigo_cli.deliveryTime, "hours");
        let teste = order.confirmacao.isSameOrBefore(d);

        // order.dataTest = d;

        return order.confirmacao.isSameOrBefore(d);
      });

      data.waitingSeparation.forEach(order => {
        let d = order.criacao.clone();

        let time = order.codigo_cli.deliveryTime;
        let rest = time % 8;
        let loop = (time - rest) / 8;

        while (loop) {
          d.add(8, "hours");

          // Se for sabado ou domingo add 1 dia
          while (d.isoWeekday() == 6 || d.isoWeekday() == 7) {
            d.add(1, "days");
          }

          --loop;
        }

        if (rest) {
          d.add(rest, "hours");

          // Se for sabado ou domingo add 1 dia
          while (d.isoWeekday() == 6 || d.isoWeekday() == 7) {
            d.add(1, "days");
          }
        }

        //virou a semana
        // if (dClone.isoWeekday() < isoDay || dClone.isoWeekday() == 6 || dClone.isoWeekday() == 7 || d.isoWeekday() == 6 || d.isoWeekday() == 7) {
        //     // Se for sabado ou domingo add 1 dia
        //     while (d.isoWeekday() == 6 || d.isoWeekday() == 7) {
        //         d.add(1, 'days');
        //     }
        // }

        // d.add(order.codigo_cli.deliveryTime, 'hours');

        // Se for sabado ou domingo add 1 dia
        // while (d.isoWeekday() == 6 || d.isoWeekday() == 7) {
        //     d.add(1, 'days');
        // }

        // data atual é maior que criacao + deliveryTime
        // order.waidt = d;
        if (date.isSameOrBefore(d)) {
          // smile
          order.state = "smile";
        } else {
          // sad
          order.state = "sad";
        }
      });

      //Porcetagem de separação no prazo
      data.percentSeparatedInTime =
        (100 * data.separatedInTime.length) / data.separatedInMonth.length;
      data.totalSeparatedInMonth = data.separatedInMonth.length;
      data.totalWaitingSeparation = data.waitingSeparation.length;
    }

    ctx.body = data;
    ctx.status = 200;
  }

  //   Operational panel
  static async operationalData(ctx: Context, next: Function) {
    let customers = await CustomerModel.find().populate({
      path: "account",
      match: {
        active: true
      }
    });

    // Parece desnecessario
    //   customers = customers.filter(cli => {
    //     return cli.account != null;
    //   });

    let orders = await LmxSP.getInstance().getAllOrders(customers);
    let data: any = {};
    let date = moment();
    const SEPARACAO = 85;
    const CONFERENCIA = 90;

    if (orders && orders.length) {
      // ****O tempo de separação***
      let separatedInMonth = orders.filter(order => {
        return (
          order.confirmacao &&
          order.confirmacao.year() == date.year() &&
          order.confirmacao.month() == date.month()
        );
      });

      let separatedInTime = separatedInMonth.filter(order => {
        //*** se a data de confirmação ocorreu 48 depois da criação
        let d = order.criacao.clone();

        //*** Se for sabado ou domingo add 1 dia
        while (d.isoWeekday() == 6 || d.isoWeekday() == 7) {
          d.add(1, "days");
        }

        d.add(order.codigo_cli.deliveryTime, "hours");
        return order.confirmacao.isSameOrBefore(d);
      });
      data.percentSeparatedInTime =
        (100 * separatedInTime.length) / separatedInMonth.length;
      //Esse é paraporcetagem

      //**** Pedidos que estão em coferência***
      data.confirmed = orders.filter(order => {
        return ["CONFERENCIA"].indexOf(order.status) > -1;
      });

      // ***Coluna, Totais por cliente***
      data.totaisPorCliente = data.confirmed
        .map((order, index, array) => {
          let t = array.reduce((orderPrev, orderCurrent) => {
            return (orderPrev +=
              orderCurrent.codigo_cli.code == order.codigo_cli.code ? 1 : 0);
          }, 0);
          return {
            client: order.codigo_cli,
            code: order.codigo_cli.code,
            total: t
          };
        })
        .reduce((orderPrev, orderCurrent) => {
          orderPrev[orderCurrent.code] = orderPrev[orderCurrent.code] || [];
          orderPrev[orderCurrent.code] = orderCurrent;
          return orderPrev;
        }, [])
        .filter(Boolean);
      data.total = data.confirmed.length;

      // Calcular tempo
      data.confirmed.forEach(order => {
        let separation = order.historico
          .filter(hist => {
            return hist.cod_situacao == SEPARACAO;
          })
          .reduce((prev, current) => {
            return prev.data_historico > current.data_historico
              ? prev
              : current;
          });

        //**Calcular tempo da coluna tempo separação */

        let conference = order.historico
          .filter(hist => {
            return hist.cod_situacao == CONFERENCIA;
          })
          .reduce((prev, current) => {
            return prev.data_historico > current.data_historico
              ? prev
              : current;
          });
        order.separation = separation;
        order.conference = conference;

        let ms = conference.data_historico.diff(separation.data_historico);
        ms -= Util.getInstance().removeWeekday(separation.data_historico);
        let duration = moment.duration(ms);
        let hours = duration.asHours();
        let days = 0;

        if (hours >= 24) {
          days = Math.floor(hours / 24);
          hours = hours % 24;
        }

        if (hours <= -24) {
          days = Math.floor(hours / -24);
          hours = hours % -24;
        }

        let isLate = hours > 0;
        hours = Math.abs(hours);
        order.time_separation = {
          isLate: isLate,
          time: `${
            days > 0 ? (days > 1 ? days + " dias " : days + " dia ") : ""
          }${Math.floor(hours)}${moment.utc(ms).format(":mm:ss")}`
        };

        //tempo do prazo de conferencia
        let now = moment();
        let cloneDataCriacao = order.criacao.clone();
        cloneDataCriacao.add(order.codigo_cli.deliveryTime, "hours");
        ms = now.diff(cloneDataCriacao);
        ms -= Util.getInstance().removeWeekday(cloneDataCriacao);
        duration = moment.duration(ms);
        // let days = now.diff(cloneDataCriacao,'days');

        hours = duration.asHours();
        days = 0;

        if (hours >= 24) {
          days = Math.floor(hours / 24);
          hours = hours % 24;
        }

        if (hours <= -24) {
          days = Math.floor(hours / -24);
          hours = hours % -24;
        }

        isLate = hours > 0;
        hours = Math.abs(hours);
        order.ms = ms;
        order.timeConference = {
          isLate: isLate,
          time: `${
            days > 0 ? (days > 1 ? days + " dias " : days + " dia ") : ""
          }${Math.floor(hours)}${moment.utc(ms).format(":mm:ss")}`
        };
        // *
      });

      //
      data.confirmed = data.confirmed.sort((a, b) => {
        return b.ms - a.ms;
      });
    }

    ctx.body = data;
    ctx.status = 200;
  }
}
