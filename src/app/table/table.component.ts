import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import IColumns from './interfaces/columns';
import ITableDeleteEvent from './interfaces/delete-event';
import IRow from './interfaces/row';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit {

  constructor() { }

  // #region Inputs
  @Input() rows: IRow[] = [];
  @Input() columns: IColumns = {};
  @Input() perPage: number = 10;
  @Input() deletable: boolean = false;
  @Input() editable: boolean = false;
  @Input() selectable: boolean = false;
  // #endregion

  // #region Outputs
  @Output() delete = new EventEmitter<ITableDeleteEvent>();
  // #endregion

  // #region Two-way data
  @Input() selected: IRow[] = [];
  @Output() selectedChange = new EventEmitter<IRow[]>();

  onSelect({ selected }: { selected: IRow[] }) {
    this.selected = selected;
    this.selectedChange.emit(this.selected);
  }
  // #endregion

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  ngOnInit(): void {
  }

  columnsKeys() {
    return Object.keys(this.columns);
  }

  _delete(row: IRow, rowIndex: number) {
    this.delete.emit({ row, rowIndex })
  }

}
