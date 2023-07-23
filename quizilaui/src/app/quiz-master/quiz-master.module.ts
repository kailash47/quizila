import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';


const routes: Routes = [
  {
    path:'',
    redirectTo:'quiz-master',
  },
  {
    path:'quiz-master',
    component:QuizListComponent
  }
]

@NgModule({
  declarations: [
    QuizListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class QuizMasterModule { }
