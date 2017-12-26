import fastcsv = require("fast-csv");
import tempy = require("tempy");
import fs = require("fs");

import { ICSVEditor, IEvents, IEditEvents, IReadEvents } from "./types";

/** file i/o helpers */
const getCsvStream = (file: string, delimiter: string) => {
  // append flag : we only work with empty files or adding data
  const fileStream = fs.createWriteStream(file, { flags: "a" });
  const csvStream = fastcsv.createWriteStream({
    headers: true,
    delimiter: delimiter
  });

  csvStream.pipe(fileStream);
  return csvStream;
};

const copyCsv = (from: string, to: string) =>
  new Promise((resolve, reject) => {
    const fromStream = fs.createReadStream(from);
    fromStream.on("error", reject);

    const toStream = fs.createWriteStream(to);
    toStream.on("error", reject).on("close", resolve);

    fromStream.pipe(toStream);
  });
/**  */

const read = (filename: string, delimiter: string, events: IReadEvents) => {
  fastcsv
    .fromPath(filename, { delimiter: delimiter, headers: true })
    .on("data", events.onData)
    .on("error", events.onError)
    .on("end", events.onEnd);
};

const edit = (filename: string, delimiter: string, events: IEditEvents) => {
  const copy = tempy.file();
  const tempStream = getCsvStream(copy, delimiter);

  fastcsv
    .fromPath(filename, { delimiter: delimiter, headers: true })
    .on("data", data => {
      const newData = events.onEdit(data);
      // handling deletion case when editing returns nothing
      if (newData) tempStream.write(newData);
    })
    .on("error", events.onError)
    .on("end", () => {
      tempStream.end();
    });

  tempStream.on("end", () => {
    // copy data from tempfile to original file
    copyCsv(copy, filename)
      .then(events.onEnd)
      .catch(events.onError);
  });
};

const add = (
  filename: string,
  delimiter: string,
  data: Object[],
  events: IEvents
) => {
  const copy = tempy.file();
  const tempStream = getCsvStream(copy, delimiter);

  fastcsv
    .fromPath(filename, { delimiter: delimiter, headers: true })
    .on("error", events.onError)
    .on("end", () => {
      // writing added data at end of file
      for (const row of data) {
        tempStream.write(row);
      }
      tempStream.end();
    })
    .pipe(tempStream);

  tempStream.on("end", () => {
    // copy data from tempfile to original file
    copyCsv(copy, filename)
      .then(events.onEnd)
      .catch(events.onError);
  });
};

const csvEditor = (filename, delimiter): ICSVEditor => ({
  read: events => read(filename, delimiter, events),
  add: (data, events) => add(filename, delimiter, data, events),
  edit: events => edit(filename, delimiter, events)
});

export = csvEditor;
