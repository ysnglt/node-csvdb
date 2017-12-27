import csv = require("../csv-factory");
import fs = require("fs");
import util = require("util");

import { ICSVEditor, IReadEvents } from "../csv-factory/types";

const doesFileExist = (filename: string) =>
  new Promise<boolean>((resolve, reject) => {
    fs.exists(filename, resolve);
  });

const createFile = (filename: string, data: any) =>
  new Promise<void>((resolve, reject) => {
    fs.writeFile(filename, data, err => {
      err ? reject(err) : resolve();
    });
  });

const createFileIfNotExist = async (
  filename: string,
  model: string[],
  delimiter: string
) => {
  try {
    if (!await doesFileExist(filename)) {
      const headers = model.reduce((header, cell) => header + delimiter + cell);
      await createFile(filename, headers);
    }
  } catch (err) {
    throw new Error("error creating csv file : " + err);
  }
};

const hasSameModel = (obj: Object, model: string[]) => {
  const objKeys = Object.keys(obj);
  const objHasKey = key => objKeys.find(k => k === key);

  for (const key of model) {
    if (!objHasKey(key)) return false;
  }

  // if length is different, arrays are not equal
  return objKeys.length === model.length;
};

const validate = async (parser: ICSVEditor, model: string[]) => {
  let validated = false;
  // stop at first line once model has been validated
  const checkModel = data => {
    if (!validated && !hasSameModel(data, model))
      throw new Error("csv model doesn't correspond");
    validated = true;
  };

  const events: IReadEvents = {
    onData: checkModel
  };

  return parser.read(events);
};

const initDb = async (
  filename: string,
  model: string[],
  delimiter: string,
  parser: ICSVEditor
) => {
  await createFileIfNotExist(filename, model, delimiter);
  await validate(parser, model);
};

export = initDb;
