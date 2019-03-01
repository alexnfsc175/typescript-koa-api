import { Document, Schema, Types } from "mongoose";
import * as connections from "../connection/connection";
import { ISubsidiary } from "./subsidiary.model";


export interface IInvoice extends Document {
  id?: any;
  company: ISubsidiary
  number: string;
  client: string;
  cnpj: string;
  project: string;
  social_name: string;
  itens: {
    code_prod: String;
    name_prod: String;
    qtd: String;
    lack: Number;
    leftover: Number;
  }[];
  observation: string;
  quantity_pallet: Number;
  quantity_boxes: Number;
  photos: {
    code: string;
    description: string;
    // url: string;
    attachmentId: string;
  }[];
}

let schema = new Schema(
  {
    company: {
      type: Types.ObjectId,
      ref: 'subsidiary',
    },
    number: {
      type: String,
      required: true
    },
    client: {
      type: String,
      required: true
    },
    cnpj: {
      type: String,
      required: true
    },
    project: {
      type: String,
      required: true
    },
    social_name: {
      type: String,
      required: true
    },
    itens: [
      {
        code_prod: String,
        name_prod: String,
        qtd: String,
        // lack_leftover: Falta/sobra: number
        lack: {
          type: Number,
          validate: {
            validator: v => !isNaN(v),
            message: props => `${props.value} is not a valid lack!`
          },
          default: 0
        },
        leftover: {
          type: Number,
          validate: {
            validator: v => !isNaN(v),
            message: props => `${props.value} is not a valid leftover!`
          },
          default: 0
        }
      }
    ],
    // observation: Observação
    observation: {
      type: String,
      default: ""
    },
    quantity_pallet: {
      type: Number,
      validate: {
        validator: v => !isNaN(v),
        message: props => `${props.value} is not a valid quantity pallet!`
      },
      default: 0
    },
    quantity_boxes: {
      type: Number,
      validate: {
        validator: v => !isNaN(v),
        message: props => `${props.value} is not a valid quantity pallet!`
      },
      default: 0
    },
    photos: [
      {
        code: {
          type: String,
          trim: true,
          // index: true,
          // unique: true,
          sparse: true
        },
        description: String,
        attachmentId: String
      }
    ]
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

export default connections.db.model<IInvoice>(
  "invoice",
  schema,
  "invoices"
);