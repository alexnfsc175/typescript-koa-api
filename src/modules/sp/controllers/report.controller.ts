"use strict";

import { Context } from "koa";
import PhotoService from "../services/photo-type.service";
import InvoiceModel  from "../models/invoice.model";
import AttachmentModel, { Attachment, AttachmentFile} from "../models/attachment.model";
import { PassThrough } from "stream";
import Util from "../../../helpers/Util";
// import * as multer from "koa-multer";
// import * as gridfs from "mongoose-gridfs";
import * as pdfmake from "pdfmake";
import * as PdfPrinter from "pdfmake/src/printer";
import * as busboy from "async-busboy";
// instantiate mongoose-gridfs
// let Attachment = null;
// db.on("connected", () => {
//   Attachment = gridfs({
//     collection: "attachments",
//     model: "Attachment",
//     mongooseConnection: db
//   });
// });

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage
// });

const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

export default class ReportController {
  constructor(parameters) {}

  static async photosTypes(ctx: Context, next: Function) {
    const { type } = ctx.query;

    let photosTypes = await PhotoService.getPhotoTypes(type);
    ctx.body = photosTypes;
    ctx.status = 200;
  }

  static async entryReport(ctx: Context, next: Function) {
    // let image = await this._getFIle("../../../static/img/lmx-logo.png");
    let image;
    let invoice = await InvoiceModel.findOne({
      number: ctx.params.invoiceNumber
    });
    let photos = await ReportController._getImages(invoice.photos);

    const printer = new PdfPrinter({
      Roboto: {
        normal: new Buffer(
          require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
            "Roboto-Regular.ttf"
          ],
          "base64"
        ),
        bold: new Buffer(
          require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
            "Roboto-Medium.ttf"
          ],
          "base64"
        ),
        italics: new Buffer(
          require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
            "Roboto-Italic.ttf"
          ],
          "base64"
        ),
        bolditalics: new Buffer(
          require("pdfmake/build/vfs_fonts.js").pdfMake.vfs[
            "Roboto-MediumItalic.ttf"
          ],
          "base64"
        )
      }
    });

    const styles = {
      imageHeader: {
        bold: true,
        fontSize: 9,
        // color: 'white',
        // fillColor: 'black',
        alignment: "center",
        margin: [0, 8, 0, 0]
      }
    };

    let header = {
      columns: [
        {
          image: image
        },
        {
          alignment: "center",
          text: "Unidade Guarulhos",
          fontSize: 10
        },
        {
          // alignment: 'justified',
          alignment: "right",
          text: `Av. Carmela Dutra, s/n- Galpão 27 \n 
                      Jd. Pres. Dutra - Cep: 07170-150 \n 
                      Tel - 11 2348 4403 | 2088-4656`,
          fontSize: 9,
          // lineWidth: 0.5,
          lineHeight: 0.5
        }
      ],
      margin: [30, 30]
    };

    const getTableContent = () => {
      let lines = [];
      let index = 0;
      for (const item of invoice.itens) {
        const line = [];
        line.push(++index);
        line.push(item.code_prod);
        line.push(invoice.project);
        line.push(item.name_prod);
        line.push(item.qtd);
        line.push(item.lack);
        line.push(item.leftover);
        lines.push(line);
      }
      return lines;

      // for (let i = 0; i < 100; i++) {
      //     const line = [];
      //     for (let index = 0; index < 6; index++) {
      //         line.push(index);
      //     }
      //     lines.push(line);
      // }
      // return lines;
    };
    const getTable = () => {
      // layout: 'lightHorizontalLines', // optional
      return {
        style: {
          margin: [0, 5, 0, 15],
          fontSize: 9
        },
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          // widths: ['*', 'auto', 100, '*'],
          widths: ["*", "*", "*", "*", "*", "*", "*"],

          body: [
            [
              {
                text: "Seq. Item",
                bold: true
              },
              {
                text: "Código Produto",
                bold: true
              },
              {
                text: "Projeto",
                bold: true
              },
              {
                text: "Descrição",
                bold: true
              },
              {
                text: "Quant liberada NF",
                bold: true
              },
              {
                text: "Falta",
                bold: true
              },
              {
                text: "Sobra",
                bold: true
              }
              // , {
              //     text: 'Observação',
              //     bold: true
              // }
            ],
            ...getTableContent()
          ]
          // pageBreak: 'after',
        }
      };
    };

    const getPhotoPages = () => {
      return !!photos.length
        ? [
            {
              text: "Fotos do Descarregamento:",
              pageOrientation: "landscape",
              pageBreak: "before"
            },
            ...getPhotoTable(photos)
          ]
        : [];
    };

    const getPhotoTable = photos => {
      if (!photos || !photos.length) return [];
      let columns = photos.map(photo => ({
        stack: [
          {
            text: photo.description,
            style: styles.imageHeader,
            margin: [0, 8, 0, 0]
          },
          {
            image: photo.base64,
            width: 245,
            height: 200
          }
        ]
      }));

      let chuncked = Util.getInstance().toChunk(3, columns);

      return chuncked.map(columns => ({
        alignment: "center",
        columns: columns
      }));
    };

    const getContent = options => {
      options = options ? options : {};
      return [
        {
          text: "RELATÓRIO DE RECEBIMENTO DE MERCADORIAS",
          alignment: "center",
          bold: true
        },
        {
          text: `Data: ${moment().format("DD/MM/YYYY")}`,
          alignment: "right",
          fontSize: 10
        },
        {
          text: [
            "Referencia Cliente: ",
            {
              text: options.ref,
              italics: true
            },
            " Número da nota fiscal: ",
            {
              text: options.nrinvoice,
              italics: true
            }
          ],
          alignment: "right",
          margin: [0, 5],
          fontSize: 10
        },
        {
          text: [
            "Este documento certifica que a LMX Logística recebeu as referidas mercadorias de ",
            {
              text: options.name,
              italics: true
            },
            " CNPJ ",
            {
              text: options.cnpj,
              italics: true
            },
            " em aparência boa ordem, exte a carga que está sendo informada abaixo onde foi constada as avarias abaixo: \n\n",
            {
              text: [
                {
                  text: `Quantidade de Pallet: `,
                  bold: true,
                  margin: [0, 5],
                  fontSize: 10
                },
                {
                  text: `${options.quantity_pallet} `
                },

                {
                  text: `Quantidade de caixas: `,
                  bold: true,
                  margin: [0, 5],
                  fontSize: 10
                },
                {
                  text: `${options.quantity_boxes}\n\n`
                }
              ]
            }
          ],
          margin: [0, 5],
          fontSize: 10
        },
        getTable(),
        {
          text: [
            {
              text: "\n Observaçãoes: ",
              bold: true
            },
            {
              text: options.observation,
              margin: [0, 5],
              fontSize: 10
            }
          ]
        },
        ...getPhotoPages()
        // {
        //     text: 'Fotos do Descarregamento:',
        //     pageOrientation: 'landscape',
        //     pageBreak: 'before'
        // },

        // ...getPhotoTable(imgs),
      ];
    };
    var pdf = {
      //   margin: [left, top, right, bottom]
      pageMargins: [20, 120, 20, 20],
      pageSize: "A4",
      header: header,
      pageOrientation: "landscape",
      content: getContent({
        ref: invoice.client,
        nrinvoice: invoice.number,
        name: invoice.social_name,
        cnpj: invoice.cnpj,
        observation: invoice.observation,
        quantity_pallet: invoice.quantity_pallet,
        quantity_boxes: invoice.quantity_boxes
      })
      // styles: {
      //     filledHeader: {
      //         bold: true,
      //         fontSize: 9,
      //         color: 'white',
      //         fillColor: 'black',
      //         alignment: 'center'
      //     }
      // }
    };

    // Make sure the browser knows this is a PDF.
    ctx.set("content-type", "application/pdf");

    // Create the PDF and pipe it to the response object.
    var pdfDoc = printer.createPdfKitDocument(pdf);
    ctx.status = 200;
    ctx.body = pdfDoc;
    pdfDoc.end();
  }

  // static async entryReport (ctx: Context, next: Function) {
  //     try {

  //         // this.doc;
  //         function example() {
  //             var doc = new PDFDocument();

  //             var writeStream = fs.createWriteStream('filename.pdf');
  //             doc.pipe(writeStream);
  //             //line to the middle
  //             doc.lineCap('butt')
  //                 .moveTo(270, 90)
  //                 .lineTo(270, 230)
  //                 .stroke()

  //             row(doc, 90);
  //             row(doc, 110);
  //             row(doc, 130);
  //             row(doc, 150);
  //             row(doc, 170);
  //             row(doc, 190);
  //             row(doc, 210);

  //             textInRowFirst(doc, 'Nombre o razón social', 100);
  //             textInRowFirst(doc, 'RUT', 120);
  //             textInRowFirst(doc, 'Dirección', 140);
  //             textInRowFirst(doc, 'Comuna', 160);
  //             textInRowFirst(doc, 'Ciudad', 180);
  //             textInRowFirst(doc, 'Telefono', 200);
  //             textInRowFirst(doc, 'e-mail', 220);
  //             doc.end();

  //             writeStream.on('finish', function () {
  //                 // do stuff with the PDF file
  //                 return res.status(200).json({
  //                     ok: "ok"
  //                 });

  //             });
  //         }

  //         function textInRowFirst(doc, text, heigth) {
  //             doc.y = heigth;
  //             doc.x = 30;
  //             doc.fillColor('black')
  //             doc.text(text, {
  //                 paragraphGap: 5,
  //                 indent: 5,
  //                 align: 'justify',
  //                 columns: 1,
  //             });
  //             return doc
  //         }

  //         function row(doc, heigth) {
  //             doc.lineJoin('miter')
  //                 .rect(30, heigth, 500, 20)
  //                 .stroke()
  //             return doc
  //         }

  //         example();

  //         // res.json({
  //         //     reports: 'Entry'
  //         // });

  //     } catch (error) {
  //         next(error);
  //     }
  // };

  static async exitReport(ctx: Context, next: Function) {}
  static _getImages = async function(photos) {
    photos = await Promise.all(
      photos.map(photo => {
        return new Promise((resolve, reject) => {
          // const meta = await AttachmentModel.findOne({ _id: imageId });
          AttachmentModel.findOne(
            {
              _id: photo.attachmentId
            },
            (err, meta) => {
              if (err) reject(err);

              if (meta) {
                // let readstream = this.db.GridFS.createReadStream({
                //   root: `reports.photos`,
                //   _id: image.photoId
                // });
                const stream = Attachment.storage.openDownloadStream(meta._id);

                stream.on("error", error => {
                  throw error;
                });

                const bufs = [];
                stream.on("data", function(chunk) {
                  bufs.push(chunk);
                });
                stream.on("end", function() {
                  const fbuf = Buffer.concat(bufs);
                  const base64 = `data:${
                    meta.contentType
                  };base64,${fbuf.toString("base64")}`;
                  // let img = {
                  //     name: file.filename,
                  //     base64: base64
                  // }
                  // const image = {
                  //   id: imageId,
                  //   base64: base64
                  // };
                  photo.base64 = base64;

                  resolve(photo);
                });
              } else {
                reject("Arquivo não existe");
              }
            }
          );

          // const readstream = this.db.GridFS.createWriteStream({
          //     // _id: id,
          //     filename: 'screencapture-localhost-2018-04-24-18_48_17.png',
          //     content_type:'image/png'
          //   });

          //   const bufs = [];
          //   readstream.on('data', function (chunk) {
          //     bufs.push(chunk);
          //   });
          //   readstream.on('end', function () {
          //     const fbuf = Buffer.concat(bufs);
          //     const base64 = fbuf.toString('base64');
          //     console.log(base64);
          //   });

          // let bufferStream = new PassThrough();
          // bufferStream.end(req.file.buffer);

          // const readstream = this.db.GridFS.createReadStream({
          //     _id: id,
          // });

          // // readstream.pipe();

          // const bufs = [];
          // readstream.on('data', (chunk) => {
          //     bufs.push(chunk);
          // });

          // readstream.on("error", (error) => {
          //     reject(error);
          // });

          // readstream.on('end', () => {
          //     const fbuf = Buffer.concat(bufs);
          //     const base64 = fbuf.toString('base64');
          //     resolve(base64);
          //     console.log(base64);
          // });
        });
      })
    );

    return photos;

    // const readstream = this.db.GridFS.createReadStream({
    //     _id: id,
    // });

    // const bufs = [];
    // readstream.on('data', function (chunk) {
    //     bufs.push(chunk);
    // });
    // readstream.on('end', function () {
    //     const fbuf = Buffer.concat(bufs);
    //     const base64 = fbuf.toString('base64');
    //     console.log(base64);
    // });
  };

  static _getFIle = async function(pathFile) {
    let pathLogo = path.resolve(`${__dirname}${pathFile}`); //  ../../../static/img/lmx-logo.png
    //read image file
    let data = await fs.readFileSync(pathLogo);

    //error handle
    // if (err) res.status(500).send(err);

    //get image file extension name
    let extensionName = path.extname(pathLogo);

    //convert image file to base64-encoded string
    let base64Image = new Buffer(data, "binary").toString("base64");

    //combine all strings
    let imgSrcString = `data:image/${extensionName
      .split(".")
      .pop()};base64,${base64Image}`;

    //send image src string into jade compiler
    return imgSrcString;
  };

  static async saveEntryPhoto(ctx: Context, next: Function) {
    const { invoiceNumber, photoCode } = ctx.params;

    const { files, fields } = await busboy(ctx.req);
    const res = [];
    await Promise.all(
      files.map(async file => {
        await (_ => {
          return new Promise((resolve, reject) => {
            Attachment.write(
              {
                filename: file.filename,
                contentType: file.mimeType,
                metadata: { email: "alex.3.dj@gmail.com" },
                aliases: ["linux123"]
              },
              file,
              (err, createdFile) => {
                if (err) {
                  reject(err);
                } else {
                  res.push({
                    id: createdFile._id.toString(), // file._idはObjectId型
                    type: createdFile.contentType,
                    name: createdFile.filename
                  });
                  resolve();
                }
              }
            );
          });
        })();
      })
    );
    ctx.body = res;
    ctx.status = 200;
    ///////////////////////////////////////////////

    // let bufferStream = new PassThrough();
    // bufferStream.end(ctx.file.buffer);

    // https://qiita.com/gtk2k/items/51cfea05aa72d122ae11
    // https://www.npmjs.com/package/async-busboy

    // let writestream = this.db.GridFS.createWriteStream({
    //   filename: req.file.originalname,
    //   content_type: req.file.mimetype,
    //   root: "reports.photos"
    //   // root: `${req.params.type}.${req.params.root}`
    // });

    // bufferStream.pipe(writestream);

    // let data:any = await new Promise(function(resolve, reject) {
    //   writestream.on("close", resolve);
    //   writestream.on("error", reject);
    // });
    // // await data;
    // let url = `reports/photos/${data._id}`;

    // let photoType = await PhotoType.findOne({
    //   code: photoCode
    // });

    // let invoice = await InvoiceModel.findOne({
    //   number: invoiceNumber,
    //   "photos.code": {
    //     $ne: photoCode
    //   }
    // });

    // if (invoice) {
    //   await InvoiceModel.updateOne(
    //     {
    //       number: invoiceNumber
    //     },
    //     {
    //       $push: {
    //         photos: {
    //           code: photoType.code,
    //           description: photoType.description,
    //           url: url,
    //           photoId: data._id
    //         }
    //       }
    //     }
    //   );
    // } else {
    //   // Deletar imagem antiga do bd
    //   //Update
    //   invoice = await InvoiceModel.updateOne(
    //     {
    //       number: invoiceNumber,
    //       "photos.code": photoCode
    //     },
    //     {
    //       $set: {
    //         "photos.$.code": photoType.code,
    //         "photos.$.description": photoType.description,
    //         "photos.$.url": url,
    //         "photos.$.photoId": data._id
    //       }
    //     }
    //   );
    // }
  }

  static async saveExitPhoto(ctx: Context, next: Function) {}
  static async saveExitPhoto2(ctx: Context, next: Function) {}
}
