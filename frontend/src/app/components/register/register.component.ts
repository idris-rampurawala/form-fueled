import { Router } from '@angular/router';
import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerFormGroup: FormGroup;
  submitted = false;
  alertMsgs: KeyValue<string, string>[] = [];

  nameCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  repeatPasswordCtrl: FormControl;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
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
    this.repeatPasswordCtrl = new FormControl('', []);
    this.nameCtrl = new FormControl('', [
      Validators.maxLength(200),
      Validators.required
    ]);
    this.registerFormGroup = new FormGroup({
      email: this.emailCtrl,
      password: this.passwordCtrl,
      repeatPassword: this.repeatPasswordCtrl,
      name: this.nameCtrl
    });
  }

  ngOnInit(): void {
    this.repeatPasswordCtrl.setValidators(this.repeatPasswordValidator(this.passwordCtrl));
    this.registerFormGroup.addControl('repeatPassword', this.repeatPasswordCtrl);
  }

  onSubmit(): void {
    this.submitted = true;
    this.alertMsgs = [];
    this.registerFormGroup.markAllAsTouched();
    if (this.registerFormGroup.invalid) {
      this.submitted = false;
      return;
    }
    this.authenticationService.register(
      this.registerFormGroup.controls.email.value,
      this.registerFormGroup.controls.password.value,
      this.registerFormGroup.controls.name.value)
      .subscribe((data: any) => {
        this.submitted = false;
        this.router.navigate(['login'], { queryParams: { code: 'REGISTERED', type: 'success' } });
      }, (error: HttpErrorResponse) => {
        for (const [key, value] of Object.entries(error.error)) {
          console.log(key, value);
          this.alertMsgs.push({
            key,
            value: value[0]
          });
        }
        this.submitted = false;
      });
  }

  onReset(): void {
    this.registerFormGroup.reset();
  }

  repeatPasswordValidator(pControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (control.value !== pControl.value)) {
        return { invalid: true };
      }
      return null;
    };
  }

}
