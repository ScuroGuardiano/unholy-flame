import { Component, Input, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { StaticService } from './static.service';

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.scss']
})
export class StaticComponent implements OnInit {

  constructor(
    private staticService: StaticService,
    private toastrService: NbToastrService
  ) { }

  @Input() name: string = '';
  @Input() docId?: string;


  saving = false;
  reading = false;
  content = '';
  modifiedContent = '';
  modifiedContentBackup = '';

  async ngOnInit(): Promise<void> {
    if (!this.docId) {
      throw new Error(`Error! DocId has to be set on StaticComponent.`)
    }

    this.reading = true;
    this.content = await this.staticService.get(this.docId);
    this.reading = false;

    this.modifiedContent = this.content;
  }

  get modified() {
    return this.content !== this.modifiedContent;
  }
  get canGoBack() {
    return this.modifiedContentBackup && !this.modified;
  }

  undoChanges() {
    this.modifiedContentBackup = this.modifiedContent;
    this.modifiedContent = this.content;
  }
  fuckGoBack() {
    this.modifiedContent = this.modifiedContentBackup;
    this.modifiedContentBackup = '';
  }
  async save() {
    if (!this.docId) {
      throw new Error(`Error! DocId has to be set on StaticComponent.`)
    }

    this.saving = true;
    await this.staticService.save(this.docId, this.modifiedContent);
    this.content = this.modifiedContent;
    this.saving = false;

    this.toastr("success", "Success", `The content was saved`);
  }

  private toastr(status: string, title: string, message: string) {
    this.toastrService.show(message, title, { status, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 6000 });
  }
}
