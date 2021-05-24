
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class FormSharedService {
  constructor(private http: HttpClient) { }

  public getFormDetails(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/questionnaires/shared/${id}/`);
  }

  public saveFormResponse(id: string, data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/questionnaires/shared/${id}/`, data);
  }

}
