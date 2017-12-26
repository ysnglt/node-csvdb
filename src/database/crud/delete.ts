import read = require("./read");
import utils = require("../../utils");

import { ICSVEditor, IEditEvents } from "../../csv-factory/types";

const erase = async (parser: ICSVEditor, predicate: Object) =>
  new Promise<Object[]>((resolve, reject) => {
    const deletedData = [];

    const deleteData = data => {
      if (utils.isSubsetOf(predicate, data)) {
        deletedData.push(data);
      } else return data;
    };

    const events: IEditEvents = {
      onEdit: deleteData,
      onError: err =>
        reject(new Error("error deleting data from CSV : " + err)),
      onEnd: () => resolve(deletedData)
    };

    parser.edit(events);
  });

export = erase;
