// import { Document } from "mongoose";
// import { environment } from "../../common/environment";
// import { default as config } from '../../config/env';
// import  * as connections from '../../config/connection/connection'

export class Migrate {
  connection = null;
  // private toPromise(document) {
  //   return new Promise((resolve, reject) => {
  //     document.save((err, document) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       console.log(`${document.constructor.modelName} created successful`);
  //       resolve(document);
  //     });
  //   });
  // }

  // private insert(documents) {
  //   let promises: Promise<any>[] = [];

  //   for (const document of documents) {
  //     promises.push(this.toPromise(document));
  //   }

  //   return Promise.all(promises.map(p => p.catch(err => console.log(err))));
  // }
  constructor(connection:any){
    this.connection = connection;
  }

  async run(migrations: Migration<any>[]) {
    for (const migration of migrations) {
      await migration.run().catch(err=>console.log(err));
    }

    process.kill(process.pid);
  }
}

export interface Migration<T> {
  run(): Promise<T>;
}
