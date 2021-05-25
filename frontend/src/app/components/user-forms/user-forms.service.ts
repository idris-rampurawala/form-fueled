
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { PaginatedBaseResponse, BaseResponse } from '../../interfaces/common.interface';
import { UserForms } from './interfaces/user-forms.interface';

@Injectable()
export class UserFormsService {
  constructor(private http: HttpClient) { }

  public getAllForms(next: string): Observable<PaginatedBaseResponse<UserForms[]>> {
    const params = next ? `?c=${next}` : '';
    return this.http.get<PaginatedBaseResponse<UserForms[]>>(`${environment.apiUrl}/questionnaires/${params}`);
  }

  public deleteForm(id: string): Observable<BaseResponse<string>> {
    return this.http.delete<BaseResponse<string>>(`${environment.apiUrl}/questionnaires/${id}/`);
  }
}
