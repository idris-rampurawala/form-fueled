
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseResponse } from '../../interfaces/common.interface';
import { FormAPIResponse } from './interfaces/form-shared.interface';

@Injectable()
export class FormSharedService {
  constructor(private http: HttpClient) { }

  public getFormDetails(id: string): Observable<BaseResponse<FormAPIResponse>> {
    return this.http.get<BaseResponse<FormAPIResponse>>(`${environment.apiUrl}/questionnaires/shared/${id}/`);
  }

  public saveFormResponse(id: string, data: any): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${environment.apiUrl}/questionnaires/shared/${id}/`, data);
  }

}
