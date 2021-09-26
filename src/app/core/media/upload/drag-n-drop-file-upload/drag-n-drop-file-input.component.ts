import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-drag-n-drop-file-input',
  templateUrl: './drag-n-drop-file-input.component.html',
  styleUrls: ['./drag-n-drop-file-input.component.scss'],
})
export class DragNDropFileUploadInput implements OnInit {

  constructor(private toastrService: NbToastrService) { }

  files: File[] = [];
  dragItemInZone = false;
  noTranstion = true;

  @Input() disabled: boolean = false;
  @Output() input = new EventEmitter<File[]>();

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    setTimeout(() => this.noTranstion = false, 0); // Prevents CSS transition on route enter
  }

  // #region HTML Input type="file"
  onFileInput() {
    const inputFiles = this.fileInput.nativeElement.files;
    if (inputFiles && inputFiles.length > 0) {
      this.addFiles(Array.from(inputFiles));
      // I am resetting file input after copying it's values, cause I don't need value in it anymore
      this.fileInput.nativeElement.value = '';
    }
  }
  //#endregion

  // #region Drag'n'Drop
  // If user accidentally misses drop zone I'll just prevent default browser behaviour. It's annoying.
  @HostListener("window:dragover", ['$event'])
  onWindowDragOver(event: DragEvent) {
    event.preventDefault();
  }
  @HostListener("window:drop", ['$event'])
  onWindowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent) {
    this.dragItemInZone = true;
  }
  onDragOver(event: DragEvent) {
    this.dragItemInZone = true;
  }
  onDragLeave(event: DragEvent) {
    this.dragItemInZone = false;
  }
  onDrop(event: DragEvent) {
    if (this.disabled) {
      return;
    }

    this.dragItemInZone = false;
    const droppedFiles = event.dataTransfer?.files;

    if (!droppedFiles || droppedFiles.length === 0) {
      return;
    }

    this.addFiles(Array.from(droppedFiles));
  }
  //#endregion

  // #region Paste
  @HostListener("window:paste", ['$event'])
  onPaste(event: ClipboardEvent) {
    if (this.disabled) {
      return;
    }

    const clipboardFiles = event.clipboardData?.files;
    if (!clipboardFiles || clipboardFiles.length === 0) {
      return;
    }

    this.addFiles(Array.from(clipboardFiles));
  }
  //#endregion

  private addFiles(filesToAdd: File[]) {
    filesToAdd.forEach(file => {
      if (this.isFileAllowed(file)) {
        return this.files.push(file);
      }
      return this.toastr("danger", "File not allowed", `File type ${file.type} of ${file.name} is not allowed.`);
    });

    this.input.emit(this.files);
  }

  private isFileAllowed(file: File) {
    const allowedContentTypes = ['image', 'audio', 'video'];

    const contentType = file.type.split('/')[0];
    return allowedContentTypes.includes(contentType);
  }

  private toastr(status: string, title: string, message: string) {
    this.toastrService.show(message, title, { status, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 6000 });
  }
}
