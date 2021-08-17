import IRow from "./row";

export default interface ITableDeleteEvent {
  row: IRow;
  rowIndex: number;
}
