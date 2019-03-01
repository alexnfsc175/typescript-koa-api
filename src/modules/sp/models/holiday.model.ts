import { Document, Schema } from "mongoose";
import * as connections from "../connection/connection";
import { ISubsidiary } from "./subsidiary.model";

export interface IHoliday extends Document {
  id?: any;
  title: string;
  start: Date;
  end: Date;
  color: {
    primary: string;
    secondary: string;
  };
  company: ISubsidiary
}

let schema = new Schema(
  {
    title: {
      type: String
    },
    start: {
      type: Date
    },
    end: {
      type: Date
    },
    color: {
      primary: {
        type: String
      },
      secondary: {
        type: String
      }
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'subsidiary',
    },
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

export default connections.db.model<IHoliday>(
  "holiday",
  schema,
  "holidays"
);
