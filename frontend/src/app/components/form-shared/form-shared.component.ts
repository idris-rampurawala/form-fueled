import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { FormSharedService } from './form-shared.service';
import { FormAPIResponse } from './interfaces/form-shared.interface';
import { QuestionTypes } from '../../enums/question';
import { HelperService } from 'src/app/services/helper.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-form-shared',
  templateUrl: './form-shared.component.html',
  styleUrls: ['./form-shared.component.scss']
})
export class FormSharedComponent implements OnInit {
  apiData: FormAPIResponse = {} as FormAPIResponse;
  token: string = null;
  submitted = false;
  responseCaptured = false;
  questionTypes = QuestionTypes;
  alertMsgs: KeyValue<string, string>[] = [];

  respondentEmailCtrl = new FormControl('', [
    Validators.minLength(5),
    Validators.maxLength(100),
    Validators.email,
    Validators.required
  ]);
  questionsFormArray: FormArray = new FormArray([], [Validators.required]);
  responseFormGroup = new FormGroup({
    respondentEmail: this.respondentEmailCtrl,
    questions: this.questionsFormArray,
  });

  constructor(
    private formSharedService: FormSharedService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService
  ) {
    this.activatedRoute.params.subscribe(params => {
      // validate token
      if ('token' in params) {
        this.token = params.token;
        this.fetchFormResponses();
      } else {
        this.toastr.error('Invalid URL', 'Error');
        // route to 404
      }
    });
  }

  ngOnInit(): void {
  }

  fetchFormResponses(): void {
    this.formSharedService.getFormDetails(this.token)
      .subscribe(data => {
        this.apiData = data.detail;
        this.apiData.questions.forEach((question, index) => {
          const questionCtrl = new FormGroup({
            id: new FormControl(index),
            answer: new FormControl('', [Validators.required]),
          });
          this.questionsFormArray.push(questionCtrl);
        });
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.toastr.error('Something went wrong.', 'Error');
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.alertMsgs = [];
    this.responseFormGroup.markAllAsTouched();
    if (this.responseFormGroup.invalid) {
      this.submitted = false;
      return;
    }
    const apiData = {
      respondent_email: this.respondentEmailCtrl.value,
      questions: []
    };
    for (const questionCtrl of this.questionsFormArray.controls) {
      const index = questionCtrl.get('id').value;
      const question = this.apiData.questions[index];
      const answers = [];
      switch (question.qtype) {
        case QuestionTypes.MCSS:
          answers.push(questionCtrl.get('answer').value);
          break;
        default:
          answers.push(questionCtrl.get('answer').value);
          break;
      }
      apiData.questions.push({
        id: question.id,
        options: answers
      });
    }
    this.formSharedService.saveFormResponse(this.token, apiData)
      .subscribe(data => {
        this.submitted = false;
        this.responseCaptured = true;
      }, (error: HttpErrorResponse) => {
        this.alertMsgs = this.helperService.getAPIErrorMessage(error);
        this.submitted = false;
      });
  }

}
