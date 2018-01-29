import read = require("./read");

import { ICSVEditor, IReadEvents } from "../../csv-editor/types";

const create = async (
  parser: ICSVEditor,
  data: Object[] | Object
): Promise<Object[]> => {
  const arrayData = data instanceof Array ? data : [data];
  if (arrayData.length < 1) return arrayData;

  await parser.add(arrayData);
  return arrayData;
};

export = create;
