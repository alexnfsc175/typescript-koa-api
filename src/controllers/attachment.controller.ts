"use strict";
// https://github.com/turbographics2000/file_uploader/blob/master/fileuploader.js
// http://clappr.io/
// https://github.com/clappr/clappr
import { Context } from "koa";
import { Attachment, AttachmentModel } from "../models/attachment.model";

export default class AttachmentController {
  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AccountController
   */
  static async get(ctx: Context, next: Function) {
    const fileId = ctx.params.id;
    let teste = Attachment;
    const meta = await AttachmentModel.findOne({ _id: fileId });
    if (!meta) {
      console.warn("meta is null", fileId);
      return;
    }
    const range = ctx.header.range;
    if (range) {
      let [start, end] = range.replace(/bytes=/, "").split("-");
      start = parseInt(start, 10);
      end = parseInt(end, 10);
      end = end < meta.length ? end : meta.length - 1; 
      const chunkSize = end - start + 1;
      ctx.set("Accept-Ranges", `bytes`);
      ctx.set("Content-Range", `bytes ${start}-${end}/${meta.length}`); 
      ctx.set("Content-Length", `${chunkSize}`);
      ctx.status = 206;
      // const stream = Attachment.storage.createReadStream({
      //   _id: fileId,
      //   root: "attachment",
      //   range: {
      //     startPos: start,
      //     endPos: end
      //   }
      // });
      const downloadStream = Attachment.storage.openDownloadStream(meta._id, {
        start: start,
        end: end
      });
      ctx.type = meta.contentType;
      ctx.body = downloadStream;
    } else {
      // const stream = Attachment.storage.createReadStream({
      //   _id: fileId,
      //   root: "attachment"
      // });
      // ctx.type = meta.contentType;
      // ctx.body = stream;
      const downloadStream = Attachment.storage.openDownloadStream(meta._id);
      ctx.type = meta.contentType;
      ctx.body = downloadStream;
    }
  }
}
