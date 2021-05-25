import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  /**
   *  Creates a formatted array of error messages. This can be utilized to show over in alert component.
   *
   * @param errorObj HttpErrorResponse object from HTTP request
   * @returns KeyValue of error key and its message. If there's no key, then key would be empty
   */
  public getAPIErrorMessage(errorObj: HttpErrorResponse): KeyValue<string, string>[] {
    const result: KeyValue<string, string>[] = [];
    if ('detail' in errorObj.error) {
      result.push({
        key: '',
        value: String(errorObj.error.detail)
      });
    } else if (errorObj.error instanceof Object) {
      for (const [key, value] of Object.entries(errorObj.error)) {
        console.log(key, value);
        result.push({
          key,
          value: value[0]
        });
      }
    } else {
      result.push({
        key: '',
        value: 'Something went wrong. Please try again later'
      });
    }
    return result;
  }

  /**
   *  Creates a key-value pair from an enum
   *
   * @param enumType Enum
   * @param excludeKeys Enum keys to exclude for key-pair
   * @param isReverse If true, it will create reverse mapped key-pair i.e. enum value will be key
   * @returns Key value pair array
   */
  public getOptionFromEnum(enumType: any, excludeKeys = [], isReverse = false): KeyValue<string, string>[] {
    const options: KeyValue<string, string>[] = [];
    for (const item in enumType) {
      if (isNaN(Number(item))) {
        if (!excludeKeys.includes(enumType[item])) {
          if (isReverse) {
            options.push({
              key: String(enumType[item]),
              value: item,
            });
          } else {
            options.push({
              key: item,
              value: String(enumType[item]),
            });
          }
        }
      }
    }
    return options;
  }
}
