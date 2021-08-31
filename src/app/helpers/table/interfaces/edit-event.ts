import IRow from "./row";

export default interface ITableEditEvent {
  row: IRow;
  rowIndex: number;
}
