"use strict";

import { Context } from "koa";
import HolidayModel, { IHoliday } from "../models/holiday.model";

export default class HolidayController {
  static async save(ctx: Context, next: Function) {
    const { title, start, end, color } = ctx.request.body;

    let holiday = await HolidayModel.create({
      title,
      start,
      end,
      color
    });

    ctx.body = holiday;
    ctx.status = 200;
  }

  static async all(ctx: Context, next: Function) {
    let holidays = await HolidayModel.find({}).lean();

    ctx.body = holidays;
    ctx.status = 200;
  }
  static async between(ctx: Context, next: Function) {
    let { start, end } = ctx.params;

    let holidays = await HolidayModel.find({
      start: {
        $gte: start,
        $lt: end
      }
    });

    ctx.body = holidays;
    ctx.status = 200;
  }

  static async update(ctx: Context, next: Function) {
    let { id } = ctx.params;

    let holiday = ctx.request.body;
    let _holiday = await HolidayModel.findOneAndUpdate(
      {
        _id: id
      },
      holiday
    );

    ctx.body = _holiday;
    ctx.status = 200;
  }

  static async delete(ctx: Context, next: Function) {
    let { id } = ctx.params;

    let holiday = await HolidayModel.deleteOne({
      _id: id
    });

    ctx.body = holiday;
    ctx.status = 200;
  }
}
