import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

const routes: Routes = [
  {
    path:'',
    redirectTo:'user-list',
  },
  {
    path:'user-list',
    component:UserComponent
  }
]


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModuleModule { }
