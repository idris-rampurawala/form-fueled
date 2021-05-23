import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';


import { UserBase, User } from '../interfaces/user.interface';

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

  getUserDetails(): Observable<UserBase> {
    return this.http.get<UserBase>(`${environment.apiUrl}/users/detail/`);
  }

}
