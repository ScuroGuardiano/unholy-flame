import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import IColumns from '../table/interfaces/columns';
import IRow from '../table/interfaces/row';
import ITag from './tag';
import { take } from 'rxjs/operators';
import slugify from 'slugify';
import { NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import ITableDeleteEvent from '../table/interfaces/delete-event';
import { ConfirmDialogComponent } from '../helpers/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  constructor(
    private firestore: AngularFirestore,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) { }

  addingTagName = '';

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
    const slug = slugify(this.addingTagName, { lower: true });
    const doc = await this.firestore.collection<ITag>('/tags').doc(slug).get().toPromise();
    if (doc.exists) {
      this.toastr("danger", "Error", "Tag already exists!");
      return;
    }

    try {
      await this.firestore.collection<ITag>('/tags').doc(slug).set({
        slug,
        name: this.addingTagName
      });
      this.toastr("success", "Success!", "Tag added!");
      this.readTags();
      this.addingTagName = '';
    }
    catch (err) {
      this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
      console.error(err);
    }
  }

  async deleteTag(deleteEvent: ITableDeleteEvent) {
    const _delete = () => {
      this.firestore.collection<ITag>('/tags').doc(deleteEvent.row.slug).delete()
        .then(() => {
          this.toastr("success", "Success!", "Tag has been deleted!");
          this.readTags();
        })
        .catch(err => {
          this.toastr("danger", "Error", `${err.code ?? 'unknown'}. Check console for full error`);
          console.error(err);
        })
    }

    this.confirmDeletingTag(deleteEvent.row.name)
      .onClose.subscribe(val => {
        if (val === true) {
          _delete();
        }
    });
  }

  confirmDeletingTag(tagName: string) {
    return this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: false,
      context: {
        header: `Deleting tag ${tagName}`,
        text: `Are you sure you want to delete tag ${tagName}? This is irreversible! Posts that are using this tag will have dead reference to it.`,
        confirmStatus: "danger",
        confirmCaption: "Yes, delete",
        abortStatus: "info",
        abortCaption: "No, don't delete"
      }
    });
  }

  readTags(limit = 10, offset = 0) {
    this.firestore.collection<ITag>('/tags',
      ref => ref.orderBy('slug').startAt(offset).limit(limit))
    .get()
    .pipe(
      take(1)
    )
    .subscribe(tags => {
      this.tags.rows = tags.docs.map(doc => {
        return {
          id: doc.id,
          name: doc.data().name,
          slug: doc.data().slug
        }
      });
    });
  }

  ngOnInit(): void {
    this.readTags();
  }

  private toastr(status: string, title: string, message: string) {
    this.toastrService.show(message, title, { status, position: NbGlobalPhysicalPosition.TOP_LEFT, duration: 6000 })
  }
}
