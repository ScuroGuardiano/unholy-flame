import { Injectable } from '@angular/core';
import { ThumbnailGeneratorService } from 'src/app/helpers/services/thumbnail-generator.service';
import { environment } from 'src/environments/environment';
import { FileForceFilename } from '../../firebase-storage/file-force-filename';
import { FirebaseStorageService } from '../../firebase-storage/firebase-storage.service';
import MultipleFilesUploadTask from '../../firebase-storage/multiple-files-upload-task';

/**
 * Don't you even ask.
 */
interface THEFLEXTAPE extends FileForceFilename {
  originalFile?: FileForceFilename;
  originalFileIdx?: number;
  isThumbnail?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MediaUploadHelperService {

  constructor(private storage: FirebaseStorageService, private thumbnailGenerator: ThumbnailGeneratorService) {}

  /**
   * Will create upload list of files and it's thumbnails - if possible to generate.
   * For each file first will upload thumbnail, then actual file.
   *
   * @param files File to upload
   * @returns Started MultipleFilesUploadTask
   */
  async uploadFilesWithThumbnails(files: File[]): Promise<MultipleFilesUploadTask> {
    const filesToUpload: FileForceFilename[] = [];

     for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx] as THEFLEXTAPE;
      file.originalFile = file;
      file.originalFileIdx = idx;

      const generatedFilename = this.storage.generateUniqueFilename(file.name);

      // I enqueue thumbnail first. I don't have fucking mental capability of creating some sort of transaction
      // So if uploading thumbnail succeeds and unloading file fails it's not a big deal, thumbnail is small
      // In reverse I'd have no thumbnail on file
      // I will make function to removing dead thumbnails and we're good.
      const thumbnail = (await this.thumbnailGenerator.generateThumbnailFromFile(file)) as THEFLEXTAPE | null;
      if (thumbnail) {
        thumbnail.forcedStorageFilename = generatedFilename + environment.unholy.media.thumbnailSuffix;
        thumbnail.originalFile = file;
        thumbnail.originalFileIdx = idx;
        thumbnail.isThumbnail = true;
        filesToUpload.push(thumbnail);
      }

      file.forcedStorageFilename = generatedFilename;
      filesToUpload.push(file);

    };

    const task = this.storage.createMultipleFilesUploadTask(filesToUpload);
    task.start(false);
    return task;
  }

  isThumbnail(file: THEFLEXTAPE) {
    return file.isThumbnail ?? false;
  }

  getOriginalFile(file: THEFLEXTAPE) {
    return file.originalFile ?? null;
  }

  getOriginalFileIdx(file: THEFLEXTAPE) {
    return file.originalFileIdx ?? -1;
  }
}
