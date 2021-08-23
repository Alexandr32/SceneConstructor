import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ToCoordinates'
})
export class ToCoordinatesPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return `${value}px`;
  }

}
