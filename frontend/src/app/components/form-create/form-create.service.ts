
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { PaginatedBaseResponse } from '../../interfaces/common.interface';
import { FormAPIResponse } from './interfaces/form-create.interface';

@Injectable()
export class FormCreateService {
  constructor(private http: HttpClient) { }

  public saveForm(data: any): Observable<PaginatedBaseResponse<FormAPIResponse>> {
    return this.http.post<PaginatedBaseResponse<FormAPIResponse>>(`${environment.apiUrl}/questionnaires/`, data);
  }

}
