import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL:string = UtilsService.BASE_URL;
  constructor(private http: HttpClient,public utils:UtilsService) { 
  }

  signIn(data:any) : Observable<any>{
    const url = `${this.baseURL}/auth/signin`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  verifyOTP(data:any) : Observable<any>{
    const url = `${this.baseURL}/auth/verify-otp`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  signOut(data:any) : Observable<any>{
    const url = `${this.baseURL}/auth/signout`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  login(data:any) : Observable<any>{
    const url = `${this.baseURL}/auth/login`;
    return this.http.post(url,data,this.utils.getHeaders());
  }
}
