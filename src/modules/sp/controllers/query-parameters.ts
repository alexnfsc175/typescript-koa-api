import { Schema } from "mongoose";
// https://github.com/greenpioneersolutions/express-query-parameters/blob/master/index.js
export class QueryParameters {
  query: {
    // strict: false, // Not supported yet
    sort: "";
    filter: {};
    limit: 20;
    skip: 0;
    select: "";
    deepPopulate: "";
    populateId: "";
    populateItems: "";
    limitToPopulateId: "";
    limitToPopulateItems: "";
    where: "";
    gt: false;
    gte: false;
    lte: false;
    lt: false;
    in: false;
    ne: false;
    nin: false;
    regex: false;
    options: false;
    size: false;
    all: false;
    equals: false;
    find: false;
    or: false;
    nor: false;
    and: false;
  };
  settings: {
    // autoParse: true, // Add support to not having to always use auto-parse
    // delete: [], // Add support to delete returned keys in later versions
    schema: [];
    adapter: "mongoose";
  };
  constructor(parameters) {}

  // select: 'test name content'
  static selectCheck(select: string | string[], schema: Schema) {
    const selected = {};
    select = Array.isArray(select) ? select : select.split(" ");

    schema.eachPath((path, type) => {
      if (!select.includes(path)) return;

      let enabled = 1;
      if (path.startsWith('-')) {
        enabled = 0;
        path = path.slice(1);
      }
      selected[path] = enabled;
    });


    // _.forEach(select, function(current) {
    //   if (!_.includes(schema, current)) {
    //     return;
    //   }

    //   var enabled = 1;
    //   if (_.startsWith(current, "-")) {
    //     enabled = 0;
    //     current = current.slice(1);
    //   }
    //   selected[current] = enabled;
    // });

    return selected;
  }
}
