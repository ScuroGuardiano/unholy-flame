import { Component, OnInit } from '@angular/core';

/**
 * I lost my sanity building this component and it's still not perfect.
 * But it works quite good and working as I wanted it to work, giving user control
 * over upload process.
 *
 * Dealing with file upload is pain in ass, really. Luckily low level work is done by Firebase SDK
 * so I just had to implement handling multiple files upload and UI.
 *
 * I don't know, I just could've done simple file upload, like Discord. You press CTRL+V, your single file is getting uploaded and that's it.
 * But no, I had to make ~~shitty~~ fancy UI component with list to upload, progresses, pausing and other useless stuff when you upload 2MB file.
 */
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor() { }

  files: File[] = [];
  inputDisabled = false;

  onFileInput(files: File[]) {
    this.files = files;
  }

  onBlockInput(value: boolean) {
    this.inputDisabled = value;
  }

  ngOnInit(): void {
  }

}
