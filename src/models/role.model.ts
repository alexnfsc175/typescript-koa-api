// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import * as bcrypt from 'bcrypt';
import { Document, Schema, Types } from "mongoose"
import * as connections from '../config/connection/connection';

export interface IRole extends Document {
    id?: any;
    name: string;
    can: string[];
    inherits: IRole[];
  }

let schema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'name must be unique'],
        uniqueCaseInsensitive: true
    },
    can: [{
        type: String,
        required: [true, 'can is required'],
    }],
    inherits: [{
        type: Types.ObjectId,
        ref: 'role'
    }]
}, {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);


// export let UserSchema = model<IRole>('user', schema, 'users', true);
export let RoleModel = connections.db.model <IRole>('role', schema, 'roles');
