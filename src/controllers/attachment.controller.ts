"use strict";
// https://github.com/turbographics2000/file_uploader/blob/master/fileuploader.js
// http://clappr.io/
// https://github.com/clappr/clappr
import { Context } from "koa";
import AttachmentModel, { Attachment } from "../models/attachment.model";
import * as busboy from "async-busboy";
import { Types } from "mongoose";

export default class AttachmentController {
  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AttachmentController
   */
  static async get(ctx: Context, next: Function) {
    const fileId = ctx.params.id;
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

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AttachmentController
   */
  static async save(ctx: Context, next: Function) {
    const { files, fields } = await busboy(ctx.req);
    const res = [];
    await Promise.all(
      files.map(async file => {
        await (_ => {
          return new Promise((resolve, reject) => {
            Attachment.write(
              {
                filename: file.filename,
                contentType: file.mimeType
                // metadata: { email: "alex.3.dj@gmail.com" },
                // aliases: ["linux123"]
              },
              file,
              (err, createdFile) => {
                if (err) {
                  reject(err);
                } else {
                  res.push({
                    id: createdFile._id.toString(), // file._idはObjectId型
                    type: createdFile.contentType,
                    name: createdFile.filename
                  });
                  resolve();
                }
              }
            );
          });
        })();
      })
    );
    ctx.body = res.length > 1 ? res : res[0];
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AttachmentController
   */
  static async delete(ctx: Context, next: Function) {
    const fileId = Types.ObjectId(ctx.params.id);
    const deleted = await (_ => {
      return new Promise((resolve, reject) => {
        Attachment.unlinkById(fileId, (err, unlinkedFile) => {
          if (err) {
            reject(err);
          }
          resolve(unlinkedFile);
        });
      });
    })();
    // const deleted = await Attachment.unlink(fileId);
    ctx.body = deleted;
    ctx.status = 204;
  }
}
