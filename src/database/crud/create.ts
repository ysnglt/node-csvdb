import read = require("./read");

import { ICSVEditor, IReadEvents } from "../../csv-factory/types";

const create = async (
  parser: ICSVEditor,
  data: Object[]
): Promise<Object[]> => {
  await parser.add(data);
  return data;
};

export = create;
