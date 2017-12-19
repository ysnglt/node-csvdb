// CSV editor typings, moved in a separate file to be used throughout the project
// disappears at npm package transpilation to JS

export interface IEvents {
  onError: (err: Error) => any;
  onEnd: () => any;
}

export interface IReadEvents extends IEvents {
  onData: (data: Object) => Object | void;
}

export interface IEditEvents extends IReadEvents {
  onEdit: (data: Object) => Object | void;
}

export interface ICSVEditor {
  read: (e: IReadEvents) => any;
  write: (data, e: IEvents) => any;
  edit: (e: IEditEvents) => any;
}
