// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import { Document, model, Schema, Types } from 'mongoose';
import * as connections from '../connection/connection';

export interface IRole extends Document {
  id?: any;
  name: string;
  can: string[];
  inherits: IRole[];
}

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: [true, 'name must be unique'],
      uniqueCaseInsensitive: true,
    },
    can: [
      {
        type: String,
        required: [true, 'can is required'],
      },
    ],
    inherits: [{ type: Schema.Types.ObjectId, ref: 'role' }],
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

export default connections.db.model<IRole>('role', schema, 'roles');
