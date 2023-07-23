import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LayoutNavComponent } from './layout-nav/layout-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QuizPlayComponent } from './quiz-play/quiz-play.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
// import { EditorPageComponent } from './editor-page/editor-page.component';
// import { NgxEditorModule } from 'ngx-editor';
@NgModule({
  declarations: [
    AppComponent,
    LayoutNavComponent,
    DashboardComponent,
    QuizPlayComponent,
    ThankYouComponent,
    // EditorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    NgxChartsModule,
    // NgxEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
