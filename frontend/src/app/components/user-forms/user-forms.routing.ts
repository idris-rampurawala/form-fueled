import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFormsComponent } from './user-forms.component';
const routes: Routes = [
  {
    path: '',
    component: UserFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserFormsRoutingModule { }
