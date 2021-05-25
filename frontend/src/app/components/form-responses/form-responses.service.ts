
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { PaginatedBaseResponse } from '../../interfaces/common.interface';
import { FormResponses } from './interfaces/form-responses.interface';

@Injectable()
export class FormResponsesService {
  constructor(private http: HttpClient) { }

  public getAllFormResponses(next: string): Observable<PaginatedBaseResponse<FormResponses[]>> {
    const params = next ? `?c=${next}` : '';
    return this.http.get<PaginatedBaseResponse<FormResponses[]>>(`${environment.apiUrl}/questionnaires/responses/${params}`);
  }

}
