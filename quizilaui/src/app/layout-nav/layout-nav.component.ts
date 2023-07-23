import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-nav',
  templateUrl: './layout-nav.component.html',
  styleUrls: ['./layout-nav.component.scss']
})
export class LayoutNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,private rest:AuthService,private router:Router) {}

  signOut(){
    
    const data = {};
    this.rest.signOut(data).subscribe(
      (res)=>{
        localStorage.clear();
        this.router.navigate(['/']);
      },
      (err)=>{
        console.error(err,'ER');
      }
    )
  }
}
