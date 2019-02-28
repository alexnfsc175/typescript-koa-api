import { Document, Schema, Types } from "mongoose";
import * as connections from "../connection/connection";
import { IAccount } from "./account.model";

export interface IPhotoType extends Document {
  id?: any;
  code: Number;
  type: string;
  description: string;
}

let schema = new Schema(
  {
    code: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
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

export default connections.db.model<IPhotoType>(
  "phototype",
  schema,
  "phototypes"
);
