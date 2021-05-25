import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserResolver } from './resolvers/user.resolver';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'shared/:token',
    loadChildren: () => import('./components/form-shared/form-shared.module').then(m => m.FormSharedModule),
  },
  {
    path: '',
    component: HomeComponent,
    resolve: {
      userDetails: UserResolver
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'forms',
        loadChildren: () => import('./components/user-forms/user-forms.module').then(m => m.UserFormsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'responses',
        loadChildren: () => import('./components/form-responses/form-responses.module').then(m => m.FormResponsesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'create',
        loadChildren: () => import('./components/form-create/form-create.module').then(m => m.FormCreateModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'forms',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
