import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';


import { User } from '../interfaces/user.interface';
import { BaseResponse } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userDetails: User;


  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  setUserDetails(userDetails: User): void {
    this.userDetails = userDetails;
  }

  getUserDetails(): Observable<BaseResponse<User>> {
    return this.http.get<BaseResponse<User>>(`${environment.apiUrl}/users/detail/`);
  }

}
