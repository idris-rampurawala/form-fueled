import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';

import { FormSharedComponent } from './form-shared.component';
import { FormSharedRoutingModule } from './form-shared.routing';
import { FormSharedService } from './form-shared.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormSharedRoutingModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [
    FormSharedComponent
  ],
  providers: [FormSharedService]
})
export class FormSharedModule { }
