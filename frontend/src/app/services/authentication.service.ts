import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';
import { UserRegisterResponse } from '../interfaces/common.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient,
    private route: Router,
    private jwtHelperService: JwtHelperService,
  ) { }

  public login(email: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<UserLoginResponse>(`${environment.apiUrl}/users/token/`, { email, password })
      .pipe(
        map(result => {
          localStorage.setItem(environment.accessTokenKey, result.access);
          return true;
        })
      );
  }

  public register(email: string, password: string, name: string): Observable<UserRegisterResponse> {
    return this.httpClient.post<UserRegisterResponse>(`${environment.apiUrl}/users/register/`, { email, password, name });
  }

  public logout(): void {
    localStorage.removeItem(environment.accessTokenKey);
    this.route.navigate(['login'], { queryParams: { code: 'SUCCESSFUL_LOGOUT' } });

  }

  public isUserLoggedIn(): boolean {
    if (this.jwtHelperService.isTokenExpired()) {
      localStorage.removeItem(environment.accessTokenKey);
      return false;
    }
    return true;
  }

}


export interface UserLoginResponse {
  refresh: string;
  access: string;
}
