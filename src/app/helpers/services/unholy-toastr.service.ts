import { Injectable } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class UnholyToastrService {

  constructor(private toastrService: NbToastrService) { }

  public info(title: string, message: string) {
    this.toastr("info", title, message);
  }
  public primary(title: string, message: string) {
    this.toastr("primary", title, message);
  }
  public success(title: string, message: string) {
    this.toastr("success", title, message);
  }
  public warning(title: string, message: string) {
    this.toastr("warning", title, message);
  }
  public danger(title: string, message: string) {
    this.toastr("danger", title, message);
  }
  public default(title: string, message: string) {
    this.toastr("default", title, message);
  }
  public constrol(title: string, message: string) {
    this.toastr("info", title, message);
  }


  public toastr(status: string, title: string, message: string) {
    this.toastrService.show(message, title, { status, position: NbGlobalPhysicalPosition.TOP_RIGHT, duration: 6000 });
  }
}
