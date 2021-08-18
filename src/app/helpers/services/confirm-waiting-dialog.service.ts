import { Injectable } from '@angular/core';
import { NbDialogConfig, NbDialogService } from '@nebular/theme';
import { ConfirmWaitingDialogComponent } from '../confirm-waiting-dialog/confirm-waiting-dialog.component';
import ConfirmWaitingDialogRef from './confirm-waiting-dialog-ref';

/**
 * Service that makes it easier to use ConfirmWaitingDialogComponent
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmWaitingDialogService {

  constructor(private dialogService: NbDialogService) { }

  public open(props: Partial<ConfirmWaitingDialogComponent> = {}, nbDialogConfig: Partial<NbDialogConfig> = {}) {
    const dialogRef = this.dialogService.open(ConfirmWaitingDialogComponent, { ...nbDialogConfig, context: props });
    return new ConfirmWaitingDialogRef(dialogRef);
  }
}
