import { Component, OnInit, TemplateRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { UserFormsService } from './user-forms.service';
import { UserForms } from './interfaces/user-forms.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-forms',
  templateUrl: './user-forms.component.html',
  styleUrls: ['./user-forms.component.scss']
})
export class UserFormsComponent implements OnInit {
  nextCursor: string = null;
  apiData: UserForms[] = [];

  bsModalRef: BsModalRef;
  delModalRef: BsModalRef;
  selectedForm: UserForms = null;

  constructor(
    private userFormsService: UserFormsService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.fetchUserForms();
  }

  fetchUserForms(): void {
    this.userFormsService.getAllForms(this.nextCursor)
      .subscribe(data => {
        this.apiData = data.detail;
        this.nextCursor = data.next_c;
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
  }


  openDeletFormModal(template: TemplateRef<any>, selectedForm: UserForms): void {
    this.delModalRef = this.modalService.show(template);
    this.selectedForm = selectedForm;
  }

  deletForm(): void {
    this.delModalRef.hide();
    this.userFormsService.deleteForm(this.selectedForm.id)
      .subscribe(data => {
        this.toastr.success('Form deleted successfully.', 'Success');
        const index = this.apiData.findIndex(x => x.id === this.selectedForm.id);
        this.apiData.splice(index, 1);
      }, (error: HttpErrorResponse) => {
        this.toastr.error(error.error[`detail`], 'Error');
      });
  }


}
