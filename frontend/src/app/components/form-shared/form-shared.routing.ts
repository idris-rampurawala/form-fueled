import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormSharedComponent } from './form-shared.component';
const routes: Routes = [
  {
    path: '',
    component: FormSharedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormSharedRoutingModule { }
