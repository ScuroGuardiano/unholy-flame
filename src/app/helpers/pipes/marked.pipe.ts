import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'marked'
})
export class MarkedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === "string" && value.length > 0) {
      return marked(value);
    }
    return value;
  }

}
