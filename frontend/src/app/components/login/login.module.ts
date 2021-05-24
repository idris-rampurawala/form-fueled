import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
  ],
  declarations: [
    LoginComponent
  ],
  providers: []
})
export class LoginModule { }
