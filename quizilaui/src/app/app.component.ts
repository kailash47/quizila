import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sb-admin';
  constructor(){
    // console.log = function () { }
    console.warn = function () { }
    console.debug = function () { }
  }
}
