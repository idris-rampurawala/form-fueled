import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCreateComponent } from './form-create.component';
const routes: Routes = [
  {
    path: '',
    component: FormCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormCreateRoutingModule { }
