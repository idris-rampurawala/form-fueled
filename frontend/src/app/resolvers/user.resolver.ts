import { catchError, map } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.userService.getUserDetails().pipe(
      map(data => {
        return data.detail;
      }),
      catchError((err) => {
        return EMPTY;
      }));
  }
}
