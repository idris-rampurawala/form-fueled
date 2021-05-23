import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LoginMessages } from '../../enums/login-messages';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  submitted = false;
  showAlert = false;
  alertType = 'danger';
  alertMsg = '';

  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  nextRoute = null;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.emailCtrl = new FormControl('', [
      Validators.minLength(5),
      Validators.maxLength(100),
      Validators.email,
      Validators.required
    ]);
    this.passwordCtrl = new FormControl('', [
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.required
    ]);
    this.loginFormGroup = new FormGroup({
      email: this.emailCtrl,
      password: this.passwordCtrl
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params[`code`]) {
        const alertType = params[`type`] ? params[`type`] : 'danger';
        this.showError(params[`code`], alertType);
      }
    });
  }

  ngOnInit(): void {
  }


  onSubmit(): void {
    this.submitted = true;
    if (this.loginFormGroup.invalid) {
      this.submitted = false;
      return;
    }
    this.authenticationService.login(this.loginFormGroup.controls.email.value, this.loginFormGroup.controls.password.value)
      .subscribe((data: any) => {
        this.submitted = false;
        this.router.navigateByUrl('forms');
      }, (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
          this.alertMsg = error.error.detail;
        } else {
          this.alertMsg = LoginMessages.SOMETHING_WRONG;
        }
        this.submitted = false;
        this.showAlert = true;
      });
  }

  onReset(): void {
    this.loginFormGroup.reset();
  }

  showError(code: string, type: string): void {
    this.showAlert = true;
    if (Object.keys(LoginMessages).includes(code)) {
      this.alertMsg = LoginMessages[code];
    } else {
      this.alertMsg = LoginMessages.SOMETHING_WRONG;
    }
    this.alertType = type;
    this.location.replaceState('login');
  }

}
