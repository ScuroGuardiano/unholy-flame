import { Pipe, PipeTransform } from '@angular/core';

const extensions = ['B', 'KB', 'MB', 'GB', 'TB'];

@Pipe({
  name: 'filesize'
})
export class FilesizePipe implements PipeTransform {

  private log1024(x: number) {
    return Math.log(x) / Math.log(1024);
  }

  private roundTo2DecimalPlaces(x: number) {
    return Math.round(x * 100) / 100;
  }

  transform(value: number, ...args: unknown[]): string {
    const orderOfMagnitude = Math.min(Math.floor(this.log1024(value)), extensions.length);
    const calculatedValue = this.roundTo2DecimalPlaces(value / 1024 ** orderOfMagnitude);
    const extension = extensions[orderOfMagnitude];

    return `${calculatedValue}${extension}`;
  }

}
