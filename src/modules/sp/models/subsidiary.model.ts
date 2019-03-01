
import { Document, Schema, Types } from 'mongoose';
import * as connections from '../connection/connection';
import { ICompany } from './company.model';

export interface ISubsidiary extends Document {
  id?: any;
  company: ICompany;
  name: string;
}

const schema = new Schema(
  {
    company:{ 
      type: Schema.Types.ObjectId,
      ref: 'company'
    },
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





export default connections.db.model<ISubsidiary>('subsidiary', schema, 'subsidiaries');
