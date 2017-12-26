import read = require("./read");

import { ICSVEditor, IReadEvents } from "../../csv-factory/types";

const create = async (parser: ICSVEditor, data: Object[]) => {
  return parser.add(data);
};

export = create;
