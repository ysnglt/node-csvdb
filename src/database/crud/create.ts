import read = require("./read");

import { ICSVEditor, IReadEvents, IEvents } from "../../csv-factory/types";

const create = async (parser: ICSVEditor, data: Object[]) => {
  return new Promise<Object[]>((resolve, reject) => {
    const events: IEvents = {
      onError: err => reject(new Error("error writing CSV : " + err)),
      onEnd: () => resolve(data)
    };

    parser.write(data, events);
  });
};

// retrieves full CSV content to not erase it
const readThenCreate = async (parser: ICSVEditor, data: Object[]) => {
  const csvData = await read(parser);
  const fullData = csvData.concat(data);

  return await create(parser, fullData);
};

export = {
  readThenCreate: readThenCreate,
  create: create
};
