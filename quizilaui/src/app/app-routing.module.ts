import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizPlayComponent } from './quiz-play/quiz-play.component';
import { LayoutNavComponent } from './layout-nav/layout-nav.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo:'auth',
    pathMatch:'full'
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./auth-module/auth-module.module').then(
      module => module.AuthModuleModule
    )
  },
  {
    path:'quiz-play',
    canActivate: [AuthGuard],
    component:QuizPlayComponent
  },
  {
    path:'thank-you',
    component:ThankYouComponent
  },
  {
    path:'app',
    component:LayoutNavComponent,
    children:[
      {
        path:'dashboard',
        canActivate: [AuthGuard],
        component:DashboardComponent
      },
      { 
        path: 'question', 
        loadChildren: () => import('./question-master/question-master.module').then(
          module => module.QuestionMasterModule
        )
      },
      { 
        path: 'quiz', 
        loadChildren: () => import('./quiz-master/quiz-master.module').then(
          module => module.QuizMasterModule
        )
      },
      { 
        path: 'user', 
        loadChildren: () => import('./user-module/user-module.module').then(
          module => module.UserModuleModule
        )
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
