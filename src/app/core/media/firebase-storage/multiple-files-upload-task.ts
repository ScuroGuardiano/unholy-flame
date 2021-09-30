import { AngularFireUploadTask } from "@angular/fire/storage";
import { Subject } from "rxjs";
import { FileForceFilename } from "./file-force-filename";
import { FirebaseStorageService } from "./firebase-storage.service";

export enum UPLOAD_STATE {
  NOT_STARTED = "not started",
  UPLOADING = "uploading",
  PAUSED = "paused",
  CANCELLED = "cancelled",
  ERRORED = "errored",
  FINISHED = "finished"
}

export interface IUploadStatus {
  currentTask: AngularFireUploadTask;
  currentFileIdx: number;
  currentFile: File;
  currentFilePercentage: number;
  currentFileUploadedBytes: number;
  totalPercentage: number;
  uploadedBytes: number;
  totalSize: number;
}

/**
 * My shitty class to make controlling uploading multiple files much easier with Firebase.
 *
 * You can monitor total and current file upload progress, pause, resume, cancel and retry on fail.
 *
 * It relies on FirebaseStorageService.
 */
export default class MultipleFilesUploadTask {
  constructor(private files: FileForceFilename[], private storageService: FirebaseStorageService) {}

  private currentTask?: AngularFireUploadTask;
  private state = UPLOAD_STATE.NOT_STARTED;
  private currentFileUploadedBytes = 0;
  private uploadedBytes = 0;
  private lastPercentage = 0;
  private totalPercentage = 0;
  private totalSize = 0;
  private currentFileIdx = -1;

  public throwPromiseError = true;

  /**
   * Subscribe to ~~PewDiePie~~ get information about upload progress.
   *
   * This will complete after successful upload or cancel and error on fail.
   */
  public uploadStatus = new Subject<IUploadStatus>();

  /**
   * Emits everytime when file is uploaded.
   *
   * This will complete after all files are uploaded or upload task is cancelled.
   */
  public fileUploaded = new Subject<{ file: File, fileIdx: number }>();

  /**
   * Current uploading state.
   */
  public get uploadState(): UPLOAD_STATE {
    return this.state;
  }

  /**
   * Starts upload task. Takes effect only on not started task.
   *
   * @param throwPromiseError Is set to false it won't throw any promise errors.
   * If you use uploadStatus Subject to detect errors, set this to false.
   *
   * @returns Promise resolving with true after all items are uploaded
   * and rejects on fail. Resolves with false when start took no effect.
   */
  async start(throwPromiseError = true) {
    this.throwPromiseError = throwPromiseError;

    if (this.state !== UPLOAD_STATE.NOT_STARTED) {
      return false;
    }

    this.totalSize = this.files.reduce((acc, curr) => acc + curr.size, 0);
    await this.uploadFiles();
    return true;
  }

  /**
   * Pauses uploading. Takes effect only if uploadState is equal to UPLOADING
   * @returns true if pause had an effect.
   */
  pause(): boolean {
    if (this.state === UPLOAD_STATE.UPLOADING && this.currentTask!.pause()) {
      this.state = UPLOAD_STATE.PAUSED;
      return true;
    }
    return false;
  }

  /**
   * Resumes uploading. Takes effect only if uploading is paused.
   * @returns true if resume had an effect
   */
  resume(): boolean {
    if (this.state === UPLOAD_STATE.PAUSED && this.currentTask!.resume()) {
      this.state = UPLOAD_STATE.UPLOADING;
      return true;
    }
    return false;
  }

  /**
   * Cancels uploading. Takes effect only if uploading is running, paused or errored.
   *
   * > Notice: **You can't restart this uploading task!**
   * @returns true if cancel had an effect
   */
  cancel(): boolean {
    if (this.state === UPLOAD_STATE.UPLOADING || this.state === UPLOAD_STATE.PAUSED || this.state === UPLOAD_STATE.ERRORED) {
      if (this.currentTask!.cancel()) {
        this.state = UPLOAD_STATE.CANCELLED;
        this.uploadStatus.complete();
        this.fileUploaded.complete();
        return true;
      }
    }
    return false;
  }

  getTotalBytesToUpload() {
    return this.files.reduce((acc, file) => acc + file.size, 0);
  }

  /**
   * Retries failed task. Takes effect only on errored upload task.
   *
   * ****_IMPORTANT! You must subscribe again to uploadStatus on this instance for progress, coz it creates new Subject!!!_****
   *
   * @returns Promise that resolves with true if retry had an effect. It rejectes on upload fail.
   */
  async retry(): Promise<boolean> {
    if (this.state !== UPLOAD_STATE.ERRORED) {
      return false;
    }

    this.uploadStatus = new Subject<IUploadStatus>();
    await this.uploadFiles(this.currentFileIdx);

    return true;
  }

  private async uploadFiles(startIdx = 0) {
    this.state = UPLOAD_STATE.UPLOADING;

    try {
      for (let fileIdx = startIdx; fileIdx < this.files.length; fileIdx++) {
        const file = this.files[fileIdx];
          this.currentFileUploadedBytes = 0;
          this.lastPercentage = 0;

          this.currentFileIdx = fileIdx;
          this.currentTask = this.storageService.uploadFile(file, file.forcedStorageFilename);
          this.currentTask.percentageChanges().subscribe(percentage => this.handlePercentageChange(percentage || 0, file, fileIdx))

          await this.currentTask;
          this.fileUploaded.next({ file, fileIdx });
      }
    }
    catch (err) {
      this.onCurrentFileUploadError(err);
      return;
    }

    this.uploadStatus.complete();
    this.fileUploaded.complete();
    this.state = UPLOAD_STATE.FINISHED;
  }

  private handlePercentageChange(percentage: number, file: File, fileIdx: number) {
    const deltaPercentage = percentage  - this.lastPercentage;
    this.currentFileUploadedBytes += file.size * (deltaPercentage / 100);
    this.uploadedBytes += file.size * (deltaPercentage / 100);
    this.totalPercentage = this.uploadedBytes / this.totalSize * 100;

    this.lastPercentage = percentage;

    this.uploadStatus.next({
      currentTask: this.currentTask!,
      currentFileIdx: fileIdx,
      currentFile: file,
      currentFilePercentage: percentage,
      totalPercentage: this.totalPercentage,
      uploadedBytes: this.uploadedBytes,
      totalSize: this.totalSize,
      currentFileUploadedBytes: this.currentFileUploadedBytes
    });
  }

  private onCurrentFileUploadError(error: any) {
    this.uploadedBytes -= this.currentFileUploadedBytes;
    this.state = UPLOAD_STATE.ERRORED;
    this.calculateTotalPercentage();
    console.log(error);
    this.uploadStatus.error(error);
    if (this.throwPromiseError) {
      throw error;
    }
  }

  private calculateTotalPercentage() {
    this.totalPercentage = this.uploadedBytes / this.totalSize * 100;
  }
}
