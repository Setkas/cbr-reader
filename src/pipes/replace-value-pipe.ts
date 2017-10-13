import {Pipe, PipeTransform} from '@angular/core';
import {AppVariables} from "../app/variables";

@Pipe({
  name: 'replaceValue'
})
export class ReplaceValuePipe implements PipeTransform {
  /**
   * Replacement string constant
   * @type {string}
   */
  private static ReplacementString = AppVariables.replaceString;

  /**
   * Replaces single replacement string by value
   * @param value
   * @param replacement
   * @return {string}
   */
  transform(value: string, replacement: string): string {
    let newVal: string = value;

    if (value.includes(ReplaceValuePipe.ReplacementString)) {
      newVal = value.replace(ReplaceValuePipe.ReplacementString, replacement);
    }

    return newVal;
  }
}
