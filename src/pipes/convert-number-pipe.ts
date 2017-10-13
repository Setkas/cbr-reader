import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertNumber'
})
export class ConvertNumberPipe implements PipeTransform {
  /**
   * Converts number by conversion rate with 2 decimal places in result
   * @param value
   * @param change
   * @return {number}
   */
  transform(value: number, change: number = 1): number {
    return Math.round((value * change) * 100) / 100;
  }
}
