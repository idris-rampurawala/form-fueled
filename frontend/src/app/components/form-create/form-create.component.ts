import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionTypes, QuestionTypesText } from '../../enums/question';
import { FormCreateService } from './form-create.service';
import { FormAPIResponse } from './interfaces/form-create.interface';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-form-create',
  templateUrl: './form-create.component.html',
  styleUrls: ['./form-create.component.scss']
})
export class FormCreateComponent implements OnInit {
  apiData: FormAPIResponse = {} as FormAPIResponse;
  submitted = false;
  formCreated = false;
  questionTypes = QuestionTypes;
  questionTypesOptions: KeyValue<string, string>[] = [];
  alertMsgs: KeyValue<string, string>[] = [];
  maxQuestions = 100;
  maxOptions = 5;
  shareableURL = null;

  nameCtrl = new FormControl('Untitled Form', [
    Validators.minLength(5),
    Validators.maxLength(100),
    Validators.required
  ]);
  descriptionCtrl = new FormControl('Form Description', [
    Validators.minLength(5),
    Validators.required
  ]);
  // restricting questions to 100
  questionsFormArray: FormArray = new FormArray([], [
    Validators.required, Validators.minLength(1), Validators.maxLength(this.maxQuestions)]);
  createFormGroup = new FormGroup({
    name: this.nameCtrl,
    description: this.descriptionCtrl,
    questions: this.questionsFormArray,
  });

  constructor(
    private formCreateService: FormCreateService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.addQuestion();
    this.questionTypesOptions = this.helperService.getOptionFromEnum(QuestionTypesText);
  }

  addQuestion(): void {
    if (this.questionsFormArray.length < 10) {
      const questionCtrl = new FormGroup({
        text: new FormControl(`Untitled Question ${this.questionsFormArray.length + 1}`, [Validators.required]),
        qtype: new FormControl(QuestionTypes.TEXT, [Validators.required]),
        options: new FormArray([], [Validators.maxLength(this.maxOptions)]),
      });
      this.questionsFormArray.push(questionCtrl);
    }
  }

  deleteQuestion(qustionIndex: number): void {
    if (this.questionsFormArray.length > 1) {
      this.questionsFormArray.removeAt(qustionIndex);
    }
  }

  addDefaultMultiChoiceOptions(control: FormArray): void {
    control.clear();
    for (let index = 0; index < this.maxOptions; index++) {
      this.addOption(control);
    }
  }

  toggleQTypeSelection(evt: any, control: FormGroup): void {
    switch (evt.target.value) {
      case QuestionTypes.MCSS:
        this.addDefaultMultiChoiceOptions(control.controls[`options`] as FormArray);
        break;
    }
  }

  deleteOption(questionCtrl: FormGroup, optionIndex: number): void {
    const optionsArr = questionCtrl.controls[`options`] as FormArray;
    if (optionsArr.length > 1) {
      optionsArr.removeAt(optionIndex);
    }
  }

  addOption(optionsCtrl: FormArray): void {
    if (optionsCtrl.length < this.maxOptions) {
      const optionCtrl = new FormGroup({
        text: new FormControl(`Answer ${optionsCtrl.length + 1}`, [Validators.required]),
        sequence: new FormControl(optionsCtrl.length),
      });
      optionsCtrl.push(optionCtrl);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.alertMsgs = [];
    this.createFormGroup.markAllAsTouched();
    if (this.createFormGroup.invalid) {
      this.submitted = false;
      return;
    }
    const apiData = {
      name: this.nameCtrl.value,
      description: this.descriptionCtrl.value,
      questions: []
    };
    for (const questionCtrl of this.questionsFormArray.controls) {
      const question = {
        text: questionCtrl.get(`text`).value,
        qtype: questionCtrl.get(`qtype`).value,
        options: []
      };
      switch (question.qtype) {
        case QuestionTypes.MCSS:
          const options = questionCtrl.get(`options`) as FormArray;
          for (const optionsCtrl of options.controls) {
            question.options.push({
              text: optionsCtrl.get(`text`).value,
              sequence: Number(optionsCtrl.get(`sequence`).value),
            });
          }
          break;
        default:
          break;
      }
      apiData.questions.push(question);
    }
    this.formCreateService.saveForm(apiData)
      .subscribe(data => {
        this.submitted = false;
        this.formCreated = true;
        this.shareableURL = `${location.origin}/shared/${data.detail.id}`;
      }, (error: HttpErrorResponse) => {
        this.alertMsgs = this.helperService.getAPIErrorMessage(error);
        this.submitted = false;
      });
  }

}
