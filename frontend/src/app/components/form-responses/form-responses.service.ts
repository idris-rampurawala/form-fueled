
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class FormResponsesService {
  constructor(private http: HttpClient) { }

  public getAllFormResponses(next: string): Observable<any> {
    const params = next ? `?c=${next}` : '';
    return this.http.get<any>(`${environment.apiUrl}/questionnaires/responses/${params}`);
  }

}
