import { EventEmitter, HostBinding, Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { UnholyToastrService } from 'src/app/helpers/services/unholy-toastr.service';
import { FirebaseStorageService } from '../../firebase-storage/firebase-storage.service';
import MultipleFilesUploadTask, { IUploadStatus, UPLOAD_STATE } from '../../firebase-storage/multiple-files-upload-task';
import { MediaUploadHelperService } from '../media-upload-helper/media-upload-helper.service';
import fileListAnimation from './file-list.animation';
import uploadEnterLeaveAnimation from './upload-enter-leave.animation';

interface FileExtended extends File {
  uploaded?: boolean;
  skipped?: boolean;
}

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  animations: [ fileListAnimation, uploadEnterLeaveAnimation ]
})
export class UploaderComponent implements OnInit {

  constructor(
    private storage: FirebaseStorageService,
    private toastrService: UnholyToastrService,
    private mediaUploadHelper: MediaUploadHelperService
    ) { }

  @HostBinding("@uploadEnterLeave") uploadEnterLeaveAnimation() {};

  @Input() files: FileExtended[] = [];
  @Output() filesChange = new EventEmitter<File[]>();

  @Output() blockInput = new EventEmitter<boolean>();

  lastUploadProgress?: IUploadStatus;
  uploadingTask?: MultipleFilesUploadTask;

  private _blockFilelistEdit = false;
  get blockFilelistEdit() {
    return this._blockFilelistEdit;
  }
  set blockFilelistEdit(value) {
    this._blockFilelistEdit = value;
    this.blockInput.emit(value);
  }

  unsubscribeUploadObservables?: Function;

  ngOnInit(): void {
  }

  //#region View get helpers

  get currentFileIdx() {
    if (this.lastUploadProgress?.currentFile) {
      return this.mediaUploadHelper.getOriginalFileIdx(this.lastUploadProgress?.currentFile);
    }
    return null;
  }

  get isUploadingThumbnail() {
    if (this.lastUploadProgress?.currentFile) {
      return this.mediaUploadHelper.isThumbnail(this.lastUploadProgress.currentFile);
    }
    return false;
  }

  get currentFilePercentage() {
    return this.lastUploadProgress?.currentFilePercentage || 0;
  }

  get totalPercentage() {
    return this.lastUploadProgress?.totalPercentage || 0;
  }

  get totalUploadedBytes() {
    return this.lastUploadProgress?.uploadedBytes || 0;
  }

  get totalUploadSize() {
    return this.uploadingTask?.getTotalBytesToUpload() || 0;
  }

  get currentFileUploadedBytes() {
    return this.lastUploadProgress?.currentFileUploadedBytes || 0;
  }

  get currentUploadingFileSize() {
   if (this.lastUploadProgress?.currentFile) {
     return this.lastUploadProgress.currentFile.size;
   }
   return 0;
  }

  get progressBarsStatus() {
    if (!this.uploadingTask) {
      return 'basic';
    }

    switch (this.uploadingTask.uploadState) {
      case UPLOAD_STATE.UPLOADING:
        return 'info';
      case UPLOAD_STATE.PAUSED:
        return 'warning';
      case UPLOAD_STATE.ERRORED:
        return 'danger';
      case UPLOAD_STATE.FINISHED:
        return 'success';
      default:
        return 'basic';
    }
  }

  get uploadButtonVisible() {
    return !this.uploadingTask
      || this.uploadingTask.uploadState === UPLOAD_STATE.NOT_STARTED
      || this.uploadingTask.uploadState === UPLOAD_STATE.CANCELLED
  }

  get cancelButtonVisible() {
    return this.uploadingTask
      && [
        UPLOAD_STATE.UPLOADING,
        UPLOAD_STATE.PAUSED,
        UPLOAD_STATE.ERRORED
      ].includes(this.uploadingTask.uploadState);
  }

  get retryButtonVisible() {
    return this.uploadingTask && this.uploadingTask.uploadState === UPLOAD_STATE.ERRORED;
  }

  get pauseButtonVisible() {
    return this.uploadingTask && this.uploadingTask.uploadState === UPLOAD_STATE.UPLOADING;
  }

  get resumeButtonVisible() {
    return this.uploadingTask && this.uploadingTask.uploadState === UPLOAD_STATE.PAUSED;
  }

  //#endregion

  async upload() {
    if (this.files.length > 0) {
      this.uploadingTask = await this.mediaUploadHelper.uploadFilesWithThumbnails(this.files);
      const uploadStatusSubscription = this.uploadingTask.uploadStatus.subscribe(
        status => this.lastUploadProgress = status,
        error => this.handleError(error),
        () => this.complete()
      );

      const fileSubscription = this.uploadingTask.fileUploaded.subscribe(this.onFileUploaded.bind(this));
      this.unsubscribeUploadObservables = () => {
        fileSubscription.unsubscribe();
        uploadStatusSubscription.unsubscribe();
      }

      this.blockFilelistEdit = true;

      this.uploadingTask.start(false);
    }
  }

  onFileUploaded({ file }: { file: File }) {
    if (this.isUploadingThumbnail) {
      return;
    }
    const realFileIdx = this.mediaUploadHelper.getOriginalFileIdx(file);
    console.log(realFileIdx);
    this.files[realFileIdx].uploaded = true;
  }

  handleError(err: any) {
    this.toastrService.danger("Error!", `Error occurred while uploading file ${this.lastUploadProgress?.currentFile.name}. Message: ${err.message}`);
  }

  complete() {
    const uploaded = this.files.filter(f => f.uploaded).length;
    this.toastrService.success("Upload finished!", `Successfully uploaded ${uploaded} file${uploaded !== 1 ? 's' : ''}.`);
    setTimeout(() => {
      this.uploadingTask = undefined;
      this.lastUploadProgress = undefined;
      this.blockFilelistEdit = false;
      this.files = [];
      this.filesChange.emit(this.files);
    }, 2000);
  }

  pause() {
    this.uploadingTask?.pause();
  }
  resume() {
    this.uploadingTask?.resume();
  }
  cancel() {
    this.unsubscribeUploadObservables!();
    this.unsubscribeUploadObservables = undefined;
    this.uploadingTask?.cancel();
    this.uploadingTask = undefined;
    this.lastUploadProgress = undefined;

    const notUploadedNorSkipped = this.files.filter(f => !f.uploaded && !f.skipped);
    const uploaded = this.files.filter(f => f.uploaded);
    this.files = notUploadedNorSkipped;
    this.filesChange.emit(this.files);
    this.blockFilelistEdit = false;
    this.toastrService.warning("Upload cancelled by user", `Upload has been cancelled, successfully uploaded ${uploaded.length} file${uploaded.length !== 1 ? 's' : ''} before cancelled by user.`)
  }

  retry() {
    if (this.uploadingTask) {
      this.uploadingTask.retry();
      this.uploadingTask.uploadStatus.subscribe(
          status => this.lastUploadProgress = status,
          error => this.handleError(error),
          () => this.complete()
      );
    }
  }

  deleteFileByArrIndex(index: number) {
    this.files.splice(index, 1);
    this.filesChange.emit(this.files);
  }

  allFilesSize() {
    return this.files.reduce((prev, curr) => prev + curr.size, 0);
  }
}
