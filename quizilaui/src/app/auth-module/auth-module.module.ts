import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../guards/auth.guard';
import { BasicGuard } from '../guards/basic.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo:'login',
  },
  {
    path:'login',
    canActivate: [BasicGuard],
    component:LoginComponent
  }
]


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModuleModule { }
