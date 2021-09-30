import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmWaitingDialogService } from 'src/app/helpers/services/confirm-waiting-dialog.service';
import { UnholyToastrService } from 'src/app/helpers/services/unholy-toastr.service';
import { MediaBrowseHelperService } from '../media-browse-helper/media-browse-helper.service';
import IMediaFile from '../media-browse-helper/media-file';

@Component({
  selector: 'app-media-element',
  templateUrl: './media-element.component.html',
  styleUrls: ['./media-element.component.scss']
})
export class MediaElementComponent implements OnInit {

  constructor(
    private mediaBrowseHelper: MediaBrowseHelperService,
    private waitingConfirmDialog: ConfirmWaitingDialogService,
    private toastrService: UnholyToastrService
  ) { }

  @Input() file?: IMediaFile;
  @Output() deleted = new EventEmitter<IMediaFile>();

  ngOnInit(): void {
  }

  async deleteFile(event: Event, file: IMediaFile) {
    event.preventDefault();

    const _delete = async () => {
      await this.mediaBrowseHelper.deleteFile(file);
      this.toastrService.success("Successfully deleted file", `File ${file.metadata.name} has been deleted`);
      this.deleted.emit(file);
    }

    const dialogRef = this.confirmDeletingFile(file);
    dialogRef.onConfirmed = async () => {
      dialogRef.startWaiting();
      await _delete();
      dialogRef.finishWaiting();
    }
  }

  private confirmDeletingFile(file: IMediaFile) {
    return this.waitingConfirmDialog.open({
      header: `Deleting file ${file.metadata.name}`,
      text: `Are you sure you want to delete file ${file.metadata.name}? This is irreversible!`,
      confirmStatus: "danger",
      confirmCaption: "Yes, delete",
      abortStatus: "info",
      abortCaption: "No, don't delete"
    }, { autoFocus: false });
  }

}
