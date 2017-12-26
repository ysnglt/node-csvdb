// CSV editor typings, moved in a separate file to be used throughout the project
// disappears at npm package transpilation to JS

export interface IReadEvents {
  onData: (data: Object) => Object | void;
}

export interface IEditEvents {
  onEdit: (data: Object) => Object | void;
}

export interface ICSVEditor {
  read: (e: IReadEvents) => any;
  add: (data) => any;
  edit: (e: IEditEvents) => any;
}
