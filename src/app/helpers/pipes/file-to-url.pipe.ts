import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'fileToUrl'
})
export class FileToUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: File, ...args: unknown[]): (SafeUrl | string) {
    if (value instanceof File) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
    }
    return "<invalid argument provided>"
  }
}
