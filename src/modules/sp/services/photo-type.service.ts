"use strict";

import LmxSP from "../../../helpers/LmxSP";
import  PhotoTypeModel  from "../models/photo-type.model";

export default class PhotoService {
  constructor(parameters) {}

  static async getPhotoTypes(type: any) {
    try {
      let avarias = await LmxSP.getInstance().getInvoiceBreakdowns();
      let photoTypes = await PhotoTypeModel.find({ type: type });

      for (const avaria of avarias) {
        let found = photoTypes.find((element, index, array) => {
          return element.code == avaria.codigo;
        });

        let changed = found ? found.description != avaria.tipo_avaria : false;

        // if (found.code == 1) {
        //     changed = true;
        // }

        if (!found && type == "damage") {
          //insere
          new PhotoTypeModel({
            code: avaria.codigo,
            type: "damage",
            description: avaria.tipo_avaria
          }).save();
        }

        if (found && changed) {
          await PhotoTypeModel.findOneAndUpdate(
            {
              _id: found._id
            },
            {
              description: avaria.tipo_avaria
            }
          );
        }
      }

      let query = type
        ? {
            type: type
          }
        : {};
      photoTypes = await PhotoTypeModel.find(query);

      return photoTypes ? photoTypes : [];
    } catch (error) {
      throw error;
    }
  }
}
