import read = require("./read");
import createUtils = require("./create");
import utils = require("../../utils");

import { ICSVEditor } from "../../csv-factory/types";

const deleteData = (array: Object[], predicate: Object) => {
  const deleted = [];
  const filtered = array.filter(data => {
    if (!utils.isSubsetOf(predicate, data)) return true;

    deleted.push(data);
    return false;
  });

  return { deleted, filtered };
};

const erase = async (parser: ICSVEditor, predicate: Object) => {
  const csvData = await read(parser);
  const { deleted, filtered } = deleteData(csvData, predicate);

  // recreating csv without deleted data
  await createUtils.create(parser, filtered);
  return deleted;
};

export = erase;
