// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import { Document, Schema, Types } from "mongoose";
import * as connections from "../config/connection/connection";
import AccountModel from "./account.model";
export interface IOAuthClient extends Document {
  id?: any;
  account?: string;
  name: string;
  clientId: string;
  clientSecret: string;
  grants: [string];
  scope: string;
  redirectUris: string[];
  accessTokenLifetime: Number; //Client-specific lifetime of generated access tokens in seconds.
  refreshTokenLifetime: Number; //Client-specific lifetime of generated refresh tokens in seconds.
}

let schema = new Schema(
  {
    name: String,
    account: {
      type: Types.ObjectId,
      ref: "account",
      sparse: true
    },
    clientId: { type: String, unique: true },
    clientSecret: { type: String, unique: true },
    grants: [{ type: String }],
    scope: { type: String },
    redirectUris: [{ type: String }],
    accessTokenLifetime: { type: Number }, //Client-specific lifetime of generated access tokens in seconds.
    refreshTokenLifetime: { type: Number } //Client-specific lifetime of generated refresh tokens in seconds.
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      getters: true
    },
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
);


export default connections.db.model<IOAuthClient>(
    "oauthclient",
    schema,
    "oauthclients"
  );
  
