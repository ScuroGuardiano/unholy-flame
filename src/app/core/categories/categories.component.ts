import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService, NbTrigger } from '@nebular/theme';
import { ConfirmWaitingDialogService } from 'src/app/helpers/services/confirm-waiting-dialog.service';
import IColumns from 'src/app/helpers/table/interfaces/columns';
import ITableDeleteEvent from 'src/app/helpers/table/interfaces/delete-event';
import IRow from 'src/app/helpers/table/interfaces/row';
import { CategoriesService } from './categories.service';
import CategoryAlreadyExistsError from './category-already-exists-error';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(
    private categoriesService: CategoriesService,
    private toastrService: NbToastrService,
    private dialogService: ConfirmWaitingDialogService
  ) { }

  addingCategoryName = '';
  addingCategoryDescription = '';
  addingInProgress = false;
  loadingCategories = false;
  deletingInProgress = false;

  NbTrigger = NbTrigger;

  categories: { columns: IColumns, rows: IRow[], selected: IRow[] } = {
    columns: {
      name: "Display name",
      slug: "Slug",
      description: "Description"
    },
    rows: [],
    selected: []
  }

  @ViewChild("addCategoryInput") addCategoryInputRef?: ElementRef<HTMLInputElement>;

  addCategoryEnterKeyupHandler() {
    this.addingCategoryName != '' && this.addCategory();
  }

  async addCategory() {
    try {
      this.addingInProgress = true;
      await this.categoriesService.addCategory({ name: this.addingCategoryName, description: this.addingCategoryDescription });
      this.toastr("success", "Success!", "Category added!");
      this.addingCategoryName = '';
      this.addingCategoryDescription = '';
      this.readCategories();
    }
    catch (err: any) {
      if (err instanceof CategoryAlreadyExistsError) {
        return this.toastr("danger", "Error", `Category ${err.categoryName}already exists!`);
      }

      console.error(err);
      this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
    }

    this.addingInProgress = false;
    setTimeout(() => this.addCategoryInputRef?.nativeElement.focus(), 0);
  }

  async deleteCategory(deleteEvent: ITableDeleteEvent) {
    const _delete = async () => {
      try {
        await this.categoriesService.deleteCategory(deleteEvent.row.slug);
        this.toastr("success", "Success!", "Category has been deleted!");
        this.readCategories();
      } catch (err) {
        this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
        console.error(err);
      }
    }

    const dialogRef = this.confirmDeletingCategory(deleteEvent.row.name);
    dialogRef.onConfirmed = async () => {
      dialogRef.startWaiting();
      await _delete();
      dialogRef.finishWaiting();
    }
  }

  confirmDeletingCategory(categoryName: string) {
    return this.dialogService.open({
      header: `Deleting category ${categoryName}`,
      text: `Are you sure you want to delete category ${categoryName}? This is irreversible! Posts that are using this category will have dead reference to it.`,
      confirmStatus: "danger",
      confirmCaption: "Yes, delete",
      abortStatus: "info",
      abortCaption: "No, don't delete"
    }, { autoFocus: false });
  }

  async deleteSelected() {
    const _delete = async () => {
      try {
        const slugs = this.categories.selected.map<string>(selectedRow => selectedRow.slug);
        const deleted = await this.categoriesService.deleteCategories(slugs);
        const categoriesNoun = `categor${deleted > 1 ? 'ies' : 'y'}`;
        this.toastr("success", "Success!", `Deleted ${deleted} ${categoriesNoun}!`);
        this.readCategories();
        this.categories.selected = [];
      } catch(err) {
        this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
        console.error(err);
      }
    }

    const dialogRef = this.confirmDeletingSelected();
    dialogRef.onConfirmed = async () => {
      dialogRef.startWaiting();
      await _delete();
      dialogRef.finishWaiting();
    }
  }

  confirmDeletingSelected() {
    const categoriesNoun = `categor${this.categories.selected.length > 1 ? 'ies' : 'y'}`;
    const thisThese = categoriesNoun === 'category' ? 'this' : 'these';
    const categoriesAmount = this.categories.selected.length;

    return this.dialogService.open({
      header: `Deleting ${categoriesAmount} ${categoriesNoun}`,
      text: `Are you sure you want to delete ${categoriesAmount} ${categoriesNoun}? This is irreversible! Posts that are using ${thisThese} ${categoriesNoun} will have dead reference to it`,
      confirmStatus: "danger",
      confirmCaption: "Yes, delete",
      abortStatus: "info",
      abortCaption: "No, don't delete"
    }, { autoFocus: false })
  }

  async readCategories(forceReloadFromDatabase = false) {
    this.loadingCategories = true;

    try {
      this.categories.rows = await this.categoriesService.getCategories(forceReloadFromDatabase);
    }
    catch(err) {
      console.error(err);
      this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
    }

    this.loadingCategories = false;
  }

  ngOnInit(): void {
    this.readCategories();
  }

  private toastr(status: string, title: string, message: string) {
    this.toastrService.show(message, title, { status, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 6000 });
  }

}
