import fs = require("fs");
import util = require("util");

import utils = require("../../utils");
import { ICSVEditor, IReadEvents } from "../../csv-factory/types";

const addFilteredData = (array: Object[], subset: Object, data: Object) =>
  utils.isSubsetOf(subset, data) ? array.push(data) : array;

const addData = (array: Object[], data: Object) => array.push(data);

const get = async (parser: ICSVEditor, predicate?: Object) => {
  const foundData = [];

  // changes behavior if a predicate is given
  const filterData = predicate
    ? data => addFilteredData(foundData, predicate, data)
    : data => addData(foundData, data);

  return new Promise<Object[]>((resolve, reject) => {
    const events: IReadEvents = {
      onData: filterData,
      onError: err => reject(new Error("error reading CSV : " + err)),
      onEnd: () => resolve(foundData)
    };

    parser.read(events);
  });
};

export = get;
