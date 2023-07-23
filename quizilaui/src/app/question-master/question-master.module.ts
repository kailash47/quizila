import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionCategoryComponent } from './question-category/question-category.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
// import { EditorPageComponent } from '../editor-page/editor-page.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'question-master',
  },
  {
    path:'question-master',
    component:QuestionListComponent
  },
  {
    path:'category-master',
    component:QuestionCategoryComponent
  }
]

@NgModule({
  declarations: [
    QuestionListComponent,
    QuestionCategoryComponent,
    // EditorPageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class QuestionMasterModule { }
