import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(private dialog: NbDialogRef<ConfirmDialogComponent>) { }

  @Input() header = "Confimation needed";
  @Input() text = "Please confirm your operation";
  @Input() confirmCaption = "Confirm";
  @Input() abortCaption = "Abort";
  @Input() confirmStatus = "success";
  @Input() abortStatus = "danger";

  ngOnInit(): void {
    this.dialog.onBackdropClick.pipe(take(1)).subscribe(() => {
      this.dialog.close(false);
    })
  }

  confirm() {
    this.dialog.close(true);
  }
  abort() {
    this.dialog.close(false);
  }

}
