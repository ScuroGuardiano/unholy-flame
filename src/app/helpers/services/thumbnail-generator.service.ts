import { Injectable } from '@angular/core';
import Compressor from 'compressorjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailGeneratorService {

  constructor() { }

  async generateThumbnailFromFile(file: File): Promise<File | null> {
    switch(file.type.split('/')[0]) {
      case "image":
        return this.generateForImage(file);
      case "video":
        return this.generateForVideo(file);
      default:
        return null;
    }
  }

  private generateForImage(file: File) {
    return new Promise<File>((resolve, reject) => {
      new Compressor(file, {
        width: environment.unholy.media.thumbnailWidth,
        quality: environment.unholy.media.thumbnailQuality,
        success(result) {
          resolve(new File([result], file.name + '_thumb', { type: 'image/jpeg' }));
        },
        error(err) {
          reject(err);
        }
      });
    })
  }

  private generateForVideo(file: File) {
    return null;
  }
}
