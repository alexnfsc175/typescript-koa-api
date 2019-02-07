import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { environment } from "../../common/environment";

export class Migrate {
  private toPromise(document) {
    return new Promise((resolve, reject) => {
      document.save((err, document) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(`${document.constructor.modelName} created successful`);
        resolve(document);
      });
    });
  }

  private insert(documents) {
    let promises: Promise<any>[] = [];

    // documents.forEach(document => {

    //     promises.push(this.toPromise(document));
    // });
    for (const document of documents) {
      promises.push(this.toPromise(document));
    }

    return Promise.all(promises.map(p => p.catch(err => console.log(err)))); 
  }

  async run(documents: Document[]) {
    // console.log('url: ', environment.db.url);
    await mongoose.connect(
      environment.db.url,
      environment.db.options
    );

    // await Promise.all(promises);
    await this.insert(documents);

    process.kill(process.pid);
  }
}
