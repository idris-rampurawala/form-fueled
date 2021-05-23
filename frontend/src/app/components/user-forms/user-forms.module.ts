import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';

import { UserFormsComponent } from './user-forms.component';
import { UserFormsRoutingModule } from './user-forms-routing.module';
import { UserFormsService } from './user-forms.service';
import { HumanizeDatePipeModule } from '../../pipes/humanize-date/humanize-date-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserFormsRoutingModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    HumanizeDatePipeModule
  ],
  declarations: [
    UserFormsComponent
  ],
  providers: [UserFormsService]
})
export class UserFormsModule { }
