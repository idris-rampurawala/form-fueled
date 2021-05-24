import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

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
}
