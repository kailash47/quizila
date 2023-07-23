import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class BasicGuard implements CanActivate {
  constructor(private router: Router, private utils: UtilsService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.utils.isUserAuthorised()){
        this.router.navigate(['/quiz-play']);
        return true;
      }else{
        // this.router.navigate(['/']);
        return true;
      }
  }
  
}