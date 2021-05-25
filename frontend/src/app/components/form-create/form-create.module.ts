import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';

import { FormCreateComponent } from './form-create.component';
import { FormCreateRoutingModule } from './form-create.routing';
import { FormCreateService } from './form-create.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormCreateRoutingModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [
    FormCreateComponent
  ],
  providers: [FormCreateService]
})
export class FormCreateModule { }
