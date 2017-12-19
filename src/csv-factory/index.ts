import fastcsv = require("fast-csv");
import { ICSVEditor, IEvents, IEditEvents, IReadEvents } from "./types";

const read = (filename: string, delimiter: string, events: IReadEvents) => {
  fastcsv
    .fromPath(filename, { delimiter: delimiter, headers: true })
    .on("data", events.onData)
    .on("error", events.onError)
    .on("end", events.onEnd);
};

const edit = (filename: string, delimiter: string, events: IEditEvents) => {
  fastcsv
    .fromPath(filename, { delimiter: delimiter, headers: true })
    .transform(events.onEdit)
    .on("data", events.onData)
    .on("error", events.onError)
    .on("end", events.onEnd);
};

const write = (
  filename: string,
  delimiter: string,
  data: any[],
  events: IEvents
) => {
  fastcsv
    .writeToPath(filename, data, {
      headers: true,
      delimiter: delimiter
    })
    .on("finish", events.onEnd)
    .on("error", events.onError);
};

const csvEditor = (filename, delimiter): ICSVEditor => ({
  read: events => read(filename, delimiter, events),
  write: (data, events) => write(filename, delimiter, data, events),
  edit: events => edit(filename, delimiter, events)
});

export = csvEditor;
