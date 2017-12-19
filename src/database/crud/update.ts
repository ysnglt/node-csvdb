import fs = require("fs");
import util = require("util");

import utils = require("../../utils");
import create = require("./create");
import { ICSVEditor, IReadEvents, IEditEvents } from "../../csv-factory/types";

const editObject = (object, subset) => {
  let editedObject = { ...object };
  Object.keys(subset).forEach(key => {
    editedObject[key] = subset[key];
  });
  return editedObject;
};

const update = async (
  parser: ICSVEditor,
  predicate: Object,
  updateValue: Object
) =>
  new Promise<{ editedData: Object[]; foundData: Object[] }>(
    (resolve, reject) => {
      const editedData = [];
      const foundData = [];

      const editData = data => {
        if (utils.isSubsetOf(predicate, data)) {
          const updated = editObject(data, updateValue);

          editedData.push(updated);
          return updated;
        }
        return data;
      };

      const events: IEditEvents = {
        onEdit: editData,
        onData: data => foundData.push(data),
        onError: err => reject(new Error("error editing CSV : " + err)),
        onEnd: () => resolve({ editedData, foundData })
      };

      parser.edit(events);
    }
  );

const updateThenCreate = async (parser, predicate, updateValue) => {
  const { editedData, foundData } = await update(
    parser,
    predicate,
    updateValue
  );
  if (editedData.length === 0) return [];

  await create.create(parser, foundData);
  return editedData;
};

export = updateThenCreate;
