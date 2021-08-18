import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { take } from 'rxjs/operators';

/**
 * Cormirm dialog that will wait until caller explicity close it.
 * Listen to the ```decisionMade``` event to get decision.
 *
 * It can show spinner aswell, just set processing to true.
 * Freaking cool isn't it?
 */
@Component({
  selector: 'app-confirm-waiting-dialog',
  templateUrl: './confirm-waiting-dialog.component.html',
  styleUrls: ['./confirm-waiting-dialog.component.scss']
})
export class ConfirmWaitingDialogComponent implements OnInit {

  constructor(private dialog: NbDialogRef<ConfirmWaitingDialogComponent>) { }

  @Input() header = "Confimation needed";
  @Input() text = "Please confirm your operation";
  @Input() confirmCaption = "Confirm";
  @Input() abortCaption = "Abort";
  @Input() confirmStatus = "success";
  @Input() abortStatus = "danger";
  /**
   * Setting this to true will show nice spinner
   */
  @Input() processing = false;

  /**
   * Will emit true when confirm button clicked and false on abort.
   *
   * Nothing will be emitted when closed on backdrop or with ESC button
   */
  @Output() decisionMade = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.dialog.onBackdropClick.pipe(take(1)).subscribe(() => {
      this.dialog.close(false);
    })
  }

  confirm() {
    this.decisionMade.emit(true);
  }
  abort() {
    this.decisionMade.emit(false);
  }
}
