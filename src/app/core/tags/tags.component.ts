import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import IColumns from '../../helpers/table/interfaces/columns';
import IRow from '../../helpers/table/interfaces/row';
import { NbGlobalPhysicalPosition, NbToastrService, NbTrigger } from '@nebular/theme';
import ITableDeleteEvent from '../../helpers/table/interfaces/delete-event';
import { TagService } from './tag.service';
import TagAlreadyExistsError from './tag-already-exists-error';
import { ConfirmWaitingDialogService } from '../../helpers/services/confirm-waiting-dialog.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  constructor(
    private tagService: TagService,
    private toastrService: NbToastrService,
    private dialogService: ConfirmWaitingDialogService
  ) { }

  addingTagName = '';
  addingInProgress = false;
  loadingTags = false;
  deletingInProgress = false;

  NbTrigger = NbTrigger;

  tags: { columns: IColumns, rows: IRow[], selected: IRow[] } = {
    columns: {
      name: "Display name",
      slug: "Slug"
    },
    rows: [],
    selected: []
  }

  @ViewChild("addTagInput") addTagInputRef?: ElementRef<HTMLInputElement>;

  addTagEnterKeyupHandler() {
    this.addingTagName != '' && this.addTag();
  }

  async addTag() {
      try {
        this.addingInProgress = true;
        await this.tagService.addTag(this.addingTagName);
        this.toastr("success", "Success!", "Tag added!");
        this.addingTagName = '';
        this.readTags();
      }
      catch (err: any) {
        if (err instanceof TagAlreadyExistsError) {
          return this.toastr("danger", "Error", `Tag ${err.tagName}already exists!`);
        }

        console.error(err);
        this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
      }

      this.addingInProgress = false;
      setTimeout(() => this.addTagInputRef?.nativeElement.focus(), 0);
  }

  async deleteTag(deleteEvent: ITableDeleteEvent) {
    const _delete = async () => {
      try {
        await this.tagService.deleteTag(deleteEvent.row.slug);
        this.toastr("success", "Success!", "Tag has been deleted!");
        this.readTags();
      } catch (err) {
        this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
        console.error(err);
      }
    }

    const dialogRef = this.confirmDeletingTag(deleteEvent.row.name);
    dialogRef.onConfirmed = async () => {
      dialogRef.startWaiting();
      await _delete();
      dialogRef.finishWaiting();
    }
  }

  confirmDeletingTag(tagName: string) {
    return this.dialogService.open({
      header: `Deleting tag ${tagName}`,
      text: `Are you sure you want to delete tag ${tagName}? This is irreversible! Posts that are using this tag will have dead reference to it.`,
      confirmStatus: "danger",
      confirmCaption: "Yes, delete",
      abortStatus: "info",
      abortCaption: "No, don't delete"
    }, { autoFocus: false });
  }

  async deleteSelected() {
    const _delete = async () => {
      try {
        const slugs = this.tags.selected.map<string>(selectedRow => selectedRow.slug);
        const deleted = await this.tagService.deleteTags(slugs);
        this.toastr("success", "Success!", `Deleted ${deleted} tag${deleted > 1 ? 's' : ''}!`);
        this.readTags();
        this.tags.selected = [];
      } catch (err) {
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
    const tagsNoun = `tag${this.tags.selected.length > 1 ? 's' : ''}`;
    const thisThese = tagsNoun === 'tag' ? 'this' : 'these';
    const tagsAmount = this.tags.selected.length;

    return this.dialogService.open({
      header: `Deleting ${tagsAmount} ${tagsNoun}`,
      text: `Are you sure you want to delete ${tagsAmount} ${tagsNoun}? This is irreversible! Posts that are using ${thisThese} ${tagsNoun} will have dead reference to it.`,
      confirmStatus: "danger",
      confirmCaption: "Yes, delete",
      abortStatus: "info",
      abortCaption: "No, don't delete"
    }, { autoFocus: false });
  }

  async readTags(forceReloadFromDatabase = false) {
    this.loadingTags = true;

    try {
      this.tags.rows = await this.tagService.getTags(forceReloadFromDatabase);
    }
    catch (err) {
      console.error(err);
      this.toastr("danger", "Error", `${err.code ?? 'unknown error'} while reading tags. Check console for full error`);
    }

    this.loadingTags = false;
  }

  ngOnInit(): void {
    this.readTags();
  }

  private toastr(status: string, title: string, message: string) {
    this.toastrService.show(message, title, { status, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 6000 });
  }
}
