
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { UserForms } from './interfaces/user-forms.interface';

@Injectable()
export class UserFormsService {
  constructor(private http: HttpClient) { }

  public getAllForms(next: string): Observable<any> {
    const params = next ? `?c=${next}` : '';
    return this.http.get<any>(`${environment.apiUrl}/questionnaires/${params}`);
  }
  public deleteForm(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/questionnaires/${id}`);
  }
}
