import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../firebase-storage/firebase-storage.service';

@Component({
  selector: 'app-browse-media',
  templateUrl: './browse-media.component.html',
  styleUrls: ['./browse-media.component.scss']
})
export class BrowseMediaComponent implements OnInit {

  constructor(private storage: FirebaseStorageService) { }

  ngOnInit(): void {
    this.storage.listFiles().then(files => {
      console.log(files.length);
      files.forEach(file => console.dir(file));
    })
  }

}
