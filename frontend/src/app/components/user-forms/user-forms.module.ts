import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { UserFormsComponent } from './user-forms.component';
import { UserFormsRoutingModule } from './user-forms.routing';
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
    ModalModule.forRoot(),
    HumanizeDatePipeModule
  ],
  declarations: [
    UserFormsComponent
  ],
  providers: [UserFormsService]
})
export class UserFormsModule { }
