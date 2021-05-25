
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class FormCreateService {
  constructor(private http: HttpClient) { }

  public saveForm(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/questionnaires/`, data);
  }

}
