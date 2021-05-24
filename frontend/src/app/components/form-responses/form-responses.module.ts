import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormResponsesComponent } from './form-responses.component';
import { FormResponsesRoutingModule } from './form-responses.routing';
import { FormResponsesService } from './form-responses.service';
import { HumanizeDatePipeModule } from '../../pipes/humanize-date/humanize-date-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormResponsesRoutingModule,
    HumanizeDatePipeModule
  ],
  declarations: [
    FormResponsesComponent
  ],
  providers: [FormResponsesService]
})
export class FormResponsesModule { }
