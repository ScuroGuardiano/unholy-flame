import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FirebaseStorageService } from '../../firebase-storage/firebase-storage.service';
import IMediaFile from './media-file';

@Injectable({
  providedIn: 'root'
})
export class MediaBrowseHelperService {
  constructor(private storage: FirebaseStorageService) { }

  async listFiles(): Promise<IMediaFile[]> {
    const fileList = await this.storage.listFiles();
    return await Promise.all(
      fileList
      .filter(file => !file.name.endsWith(environment.unholy.media.thumbnailSuffix))
      .map<Promise<IMediaFile>>(async file => {
        const fullAbsoluteURL = await this.storage.getFileAbsoluteLink(file.metadata.fullPath)

        let thumbnailAbsoluteURL = ''
        try {
          thumbnailAbsoluteURL = await this.storage.getFileAbsoluteLink(file.metadata.fullPath + environment.unholy.media.thumbnailSuffix);
        }
        catch(err) {
          console.warn(`Error while getting thumbnail: `, err);
        }

        return {
          metadata: file.metadata,
          fullAbsoluteURL,
          thumbnailAbsoluteURL
        }
      })
    );
  }

  async deleteFile(file: IMediaFile) {
    return this.storage.deleteFile(file.metadata.fullPath);
  }

  async deleteFiles(files: IMediaFile[]) {
    return Promise.all(files.map(file => this.deleteFile(file)));
  }
}
