import { EventEmitter, Injectable, Type } from '@angular/core';
import { NbDialogConfig, NbDialogService } from '@nebular/theme';
import EditWaitingDialogRef from './edit-waiting-dialog-ref';

export interface IEditWaitingDialog {
  processing: boolean;
  save: EventEmitter<any>;
}

@Injectable({
  providedIn: 'root'
})
export class EditWaitingDialogService {

  constructor(private dialogService: NbDialogService) { }

  public open<T extends IEditWaitingDialog>(component: Type<T>, props: Partial<T>, nbDialogConfig: Partial<NbDialogConfig<T>> = {}) {
    const dialogRef = this.dialogService.open(component, { ...nbDialogConfig, context: props });
    return new EditWaitingDialogRef<T>(dialogRef);
  }
}
