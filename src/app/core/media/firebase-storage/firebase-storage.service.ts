import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { clone } from 'lodash';
import IFileListItem from './file-list-item';
import MultipleFilesUploadTask from './multiple-files-upload-task';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(private storage: AngularFireStorage) { }

  private basePath = 'unholy';

  public uploadFile(file: File): AngularFireUploadTask {
    const path = this.basePath + '/' + this.generateUniqueFilename(file.name);
    return this.storage.upload(path, file);
  }

  public createMultipleFilesUploadTask(files: File[]): MultipleFilesUploadTask {
    return new MultipleFilesUploadTask(clone(files), this);
  }

  public async listFiles(): Promise<IFileListItem[]> {
    const ref = this.storage.ref(this.basePath);
    const listOfRefs = await ref.listAll().toPromise();
    const list = Promise.all(listOfRefs.items.map(async ref => {
      return {
        name: ref.name,
        metadata: await ref.getMetadata()
      }
    }));
    return list;
  }

  public async getFileAbsoluteLink(filePath: string) {
    const ref = this.storage.ref(filePath);
    return ref.getDownloadURL().toPromise();
  }

  public async deleteFile(filePath: string) {
    const ref = this.storage.ref(filePath);
    return ref.delete().toPromise();
  }

  public deleteFiles(filesPaths: string[]) {
    filesPaths.forEach(path => {
      this.deleteFile(path);
    });
  }

  private generateUniqueFilename(filename: string) {
    filename = filename ? filename : "NattenDemons";
    // I was once in guild in Nostale called "Na††en Demons"
    const time = Date.now();
    // First metal band I've listened to <3
    const randomPart = (Math.random().toString() + 'Stratovarius').substring(2, 10);
    return `${time}-${randomPart}-${filename}`;
  }
}
