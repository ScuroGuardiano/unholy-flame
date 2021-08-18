import { NbDialogRef } from "@nebular/theme";
import { takeUntil } from "rxjs/operators";
import { ConfirmWaitingDialogComponent } from "../confirm-waiting-dialog/confirm-waiting-dialog.component";

export default class ConfirmWaitingDialogRef<T extends ConfirmWaitingDialogComponent = ConfirmWaitingDialogComponent> {
  constructor(public dialogRef: NbDialogRef<T>) {
    this.component = dialogRef.componentRef.instance;
    this.component.decisionMade.pipe(
      takeUntil(this.dialogRef.onClose),
    ).subscribe(decision => {
      decision && this.onConfirmed && this.onConfirmed();
      !decision && this.onAborted && this.onAborted();
    });
  }

  /**
   * This function will be executed on confirmation
   */
  public onConfirmed: Function | undefined;

  /**
   * This function will be executed when dialog is aborted. By default it will close dialog.
   */
  public onAborted: Function = () => this.close();

  private component: T;

  /**
   * Will set dialog in waiting/processing mode - basically it will show the spinner on dialog
   */
  public startWaiting() {
    this.component.processing = true;
  }

  /**
   * Will set dialog in normal mode - basically it will stop showing spinner on dialog
   * @param close Pass true to automatically close dialog. Default: ```true```
   */
  public finishWaiting(close = true) {
    this.component.processing = false;
    close && this.close();
  }

  public close() {
    this.dialogRef.close();
  }
}
