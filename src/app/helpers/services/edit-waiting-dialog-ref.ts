import { EventEmitter } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { takeUntil } from "rxjs/operators";
import { IEditWaitingDialog } from "./edit-waiting-dialog.service";

export default class EditWaitingDialogRef<T extends IEditWaitingDialog> {
  constructor(public dialogRef: NbDialogRef<T>) {
    this.component = dialogRef.componentRef.instance;
    this.component.save.pipe(
      takeUntil(this.dialogRef.onClose)
    ).subscribe(modified => {
      this.onSave && this.onSave(modified);
    });
  }

  /**
   * Will be executed when save on dialog is pressed.
   */
  public onSave?: (modifiedObject: any) => any;

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
    close && this.dialogRef.close();
  }
}
