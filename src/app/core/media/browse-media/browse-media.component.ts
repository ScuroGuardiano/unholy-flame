import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../firebase-storage/firebase-storage.service';
import { MediaBrowseHelperService } from './media-browse-helper/media-browse-helper.service';
import IMediaFile from './media-browse-helper/media-file';

@Component({
  selector: 'app-browse-media',
  templateUrl: './browse-media.component.html',
  styleUrls: ['./browse-media.component.scss']
})
export class BrowseMediaComponent implements OnInit {

  constructor(private mediaBrowseHelper: MediaBrowseHelperService) { }

  files?: IMediaFile[];
  loading = true;

  ngOnInit(): void {
    this.mediaBrowseHelper.listFiles().then(files => {
      this.files = files;
      this.loading = false;
      files.forEach(file => console.dir(file));
    })
  }

  async fileDeleted(file: IMediaFile) {
    this.loading = true;
    this.files = await this.mediaBrowseHelper.listFiles();
    this.loading = false;
  }

}
