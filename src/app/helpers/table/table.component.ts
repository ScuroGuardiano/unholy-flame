import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
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

  @ViewChild('tabel') table: DatatableComponent | undefined;

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

  // Don't you fucking delete that
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.nxgDatatablesSizeFix();
  }

  // Don't you fucking delete that
  ngAfterViewInit() {
    this.nxgDatatablesSizeFix();
  }

  columnsKeys() {
    return Object.keys(this.columns);
  }

  _delete(row: IRow, rowIndex: number) {
    this.delete.emit({ row, rowIndex })
  }

  /**
   * I don't even know how to describe this.
   * It got me like 2-3 hours to get it right.
   *
   * I had 2 problems with ColumnMode.force and ScrollbarH=true
   *
   * One problem was that resizing columns was terribly bugged when you tried to resize column.
   * Like only click on resizing bar was enough to move everything a lot.
   * I solved that problem by setting ColumnMode.standard on table and writing my own evenly resizing algorithm
   * Which you can see in timeout callback
   *
   * Seconds problem was that if I went to other route eg. /home and went backs to table route, let's say /tags
   * the table wasn't sized properly. It's content was exactly 17px too large. And what's funny my own resizing algorithm
   * had the same bug! What I found is that on view init _innerWidth of table was wrong, it was... 17px too large.
   * But what's more funny is that when I console.dir-ed this.table it has correct size. Totally non-sense.
   * Then I discovered that expanded object console.dir is rendering at the next event loop iteration. So at ngAfterViewInit()
   * it has wrong property _innerWidth but at the very next event loop execution it has correct innerWidth.
   * That's why here is this setTimeout(() => ..., 0);\
   *
   * And one more thing. I am setting visibility:hidden at first call [bypassing ts-check coz ofc element.style is readonly for him xD]
   * and then I set it back to visible, coz there was a column size jump at render. It wasn't sexy.
   *
   * I hope that makes this clear to future me and maybe some folks who somehow found this project.
   * It has to be called on ngAfterViewInit and window resize I guess.
   */
  private nxgDatatablesSizeFix() {
    //@ts-ignore
    this.table!.element.style = "visibility: hidden;"
    setTimeout(() => {
      const innerWidth = this.table!._innerWidth;
      const fixedColumnsWidth = this.table?._internalColumns.reduce((prev, curr) => {
        return prev +  (curr.prop ? 0 : (curr.width ?? 0))
      }, 0)
      const spaceForContentColumns = innerWidth! - fixedColumnsWidth!;
      const contentColumns = this.table?._internalColumns.filter(column => column.prop !== undefined);
      const contentColumnWidth = spaceForContentColumns / contentColumns!.length;

      const columns = this.table!._internalColumns.map(internalColumn => {
        if ( internalColumn.prop ) {
          return { ...internalColumn, width: contentColumnWidth }
        }
        return { ...internalColumn }
      });

      this.table!.columns = columns;
      this.table!.recalculate();

      // I added another setTimeout here coz there was still jump from resizing ;-;
      //@ts-ignore
      setTimeout(() => this.table!.element.style = "visibility: visible;", 0);
    }, 0);
  }
}
