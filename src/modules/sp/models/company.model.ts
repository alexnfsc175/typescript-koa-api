
import { Document, Schema, Types } from 'mongoose';
import * as connections from '../connection/connection';


export interface ICompany extends Document {
  id?: any;
  name: string;
}

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: [true, 'name must be unique'],
      uniqueCaseInsensitive: true,
    }
},
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);


export default connections.db.model<ICompany>('company', schema, 'companies');
