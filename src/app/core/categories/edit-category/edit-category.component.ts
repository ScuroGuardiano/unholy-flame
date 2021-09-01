import { Component, Input, OnInit, Output } from '@angular/core';
import ICategory from '../category';
import { cloneDeep } from 'lodash';
import { EventEmitter } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  constructor(public dialog: NbDialogRef<EditCategoryComponent>) { }

  @Input() category?: ICategory;
  @Input() processing = false;

  @Output() save = new EventEmitter<ICategory>();

  modifiedCategory?: ICategory;

  get nameValid() {
    return this.category?.name.toLowerCase() === this.modifiedCategory?.name.toLowerCase();
  }

  get formValid() {
    return this.nameValid;
  }

  onSave() {
    if (this.validate()) {
      this.save.emit(this.modifiedCategory);
    }
  }

  onAbort() {
    this.dialog.close();
  }

  private validate() {
    return this.formValid;
  }

  ngOnInit(): void {
    if (this.category) {
      this.modifiedCategory = cloneDeep(this.category);
    }
  }
}
