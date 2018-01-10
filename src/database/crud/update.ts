import fs = require("fs");
import util = require("util");

import utils = require("../../utils");
import create = require("./create");

import { ICSVEditor, IEditEvents, IReadEvents } from "../../csv-editor/types";

const editObject = (object, subset) => {
  const editedObject = { ...object };
  Object.keys(subset).forEach(key => {
    editedObject[key] = subset[key];
  });
  return editedObject;
};

const update = async (
  parser: ICSVEditor,
  predicate: Object,
  updateValue: Object
): Promise<Object[]> => {
  const editedData = [];

  const editData = data => {
    if (utils.isSubsetOf(predicate, data)) {
      const updated = editObject(data, updateValue);

      editedData.push(updated);
      return updated;
    }
    return data;
  };

  const events: IEditEvents = {
    onEdit: editData
  };

  await parser.edit(events);
  return editedData;
};

export = update;
