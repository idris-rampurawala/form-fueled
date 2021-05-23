import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserFormsService } from './user-forms.service';
import { UserForms } from './interfaces/user-forms.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-forms',
  templateUrl: './user-forms.component.html',
  styleUrls: ['./user-forms.component.scss']
})
export class UserFormsComponent implements OnInit {
  nextCursor: string = null;
  apiData: UserForms[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private userFormsService: UserFormsService,
  ) {
  }

  ngOnInit(): void {
    this.fetchUserForms();
  }

  fetchUserForms(): void {
    this.userFormsService.getAllForms(this.nextCursor)
      .subscribe(data => {
        this.apiData = data.detail;
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  deletForm(id: string): void {

  }


}
