import csv = require("../csv-factory");
import fs = require("fs");
import util = require("util");

import { ICSVEditor, IReadEvents } from "../csv-factory/types";

const doesFileExist = util.promisify(fs.exists);
const createFile = util.promisify(fs.writeFile);

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

const validate = async (parser: ICSVEditor, model: string[]) => {
  return new Promise((resolve, reject) => {
    const events: IReadEvents = {
      onData: data => {}, // do nothing to fire event
      onError: err => reject(new Error("error reading CSV : " + err)),
      onEnd: resolve
    };

    parser.read(events);
  });
};

const initDb = async (filename: string, model: string[], delimiter, parser) => {
  await createFileIfNotExist(filename, model, delimiter);
  await validate(parser, delimiter);
};

export = initDb;
