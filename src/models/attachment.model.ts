// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import { Document, Schema } from "mongoose";
import * as gridfs from "mongoose-gridfs";
import * as connections from "../config/connection/connection";

export interface IAttachment extends Document {
  id?: any;
  filename: string;
  contentType: string;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  aliases: string[];
  metadata: Object;
  md5: string;
}

let schema = new Schema(
  {
    filename: String,
    contentType: String,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    aliases: Object,
    metadata: Object,
    md5: String
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);


export let Attachment = null;
connections.db.on("connected", () => {
  Attachment = gridfs({
    collection: "attachments",
    model: "attachment",
    mongooseConnection: connections.db
  });
});

export let AttachmentModel = connections.db.model<IAttachment>(
  "attachment",
  schema,
  "attachments.files"
);
