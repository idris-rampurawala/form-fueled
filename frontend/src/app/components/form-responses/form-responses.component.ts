import { Component, OnInit, TemplateRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { FormResponsesService } from './form-responses.service';
import { FormResponses } from './interfaces/form-responses.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-responses',
  templateUrl: './form-responses.component.html',
  styleUrls: ['./form-responses.component.scss']
})
export class FormResponsesComponent implements OnInit {
  nextCursor: string = null;
  apiData: FormResponses[] = [];

  constructor(
    private formResponsesService: FormResponsesService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.fetchFormResponses();
  }

  fetchFormResponses(): void {
    this.formResponsesService.getAllFormResponses(this.nextCursor)
      .subscribe(data => {
        this.apiData = data.detail;
        this.nextCursor = data.next_c;
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.toastr.error('Something went wrong.', 'Error');
      });
  }

}
