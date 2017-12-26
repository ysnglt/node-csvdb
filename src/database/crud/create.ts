import read = require("./read");

import { ICSVEditor, IReadEvents, IEvents } from "../../csv-factory/types";

const create = async (parser: ICSVEditor, data: Object[]) => {
  return new Promise<Object[]>((resolve, reject) => {
    const events: IEvents = {
      onError: err => reject(new Error("error writing CSV : " + err)),
      onEnd: () => resolve(data)
    };

    parser.add(data, events);
  });
};

export = create;
