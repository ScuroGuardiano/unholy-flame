import { Component, OnInit } from '@angular/core';
import IColumns from '../table/interfaces/columns';
import IRow from '../table/interfaces/row';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import ITableDeleteEvent from '../table/interfaces/delete-event';
import { TagService } from '../services/tag.service';
import TagAlreadyExistsError from '../errors/tag-already-exists-error';
import { ConfirmWaitingDialogService } from '../helpers/services/confirm-waiting-dialog.service';

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

  tags: { columns: IColumns, rows: IRow[] } = {
    columns: {
      id: "ID",
      name: "Display name",
      slug: "Slug"
    },
    rows: []
  }

  addTagKeyupHandler(e: KeyboardEvent) {
    if (e.key === "Enter" && this.addingTagName != '') {
      this.addTag();
    }
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
      finally {
        this.addingInProgress = false;
      }
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

  readTags(limit = 10, offset = 0) {
    this.loadingTags = true;
    this.tagService.getTags(limit, offset)
      .subscribe(
        tags => {
          this.tags.rows = tags;
        },
        err => {
          console.log(err);
          this.toastr("danger", "Error", `${err.code ?? 'unknown error'} while reading tags. Check console for full error`);
        },
        () => this.loadingTags = false);
  }

  ngOnInit(): void {
    this.readTags();
  }

  private toastr(status: string, title: string, message: string) {
    this.toastrService.show(message, title, { status, position: NbGlobalPhysicalPosition.TOP_LEFT, duration: 6000 })
  }
}
