import { Document, Schema } from "mongoose";
import * as connections from "../connection/connection";

export interface IHoliday extends Document {
  id?: any;
  title: string;
  start: Date;
  end: Date;
  color: {
    primary: string;
    secondary: string;
  };
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

export default connections.db.model<IHoliday>(
  "holiday",
  schema,
  "holidays"
);
