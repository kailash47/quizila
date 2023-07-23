import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseURL:string = UtilsService.BASE_URL;
  constructor(private http: HttpClient,public utils:UtilsService) { 
  }

  getUser(params?:any) : Observable<any>{
    const url = `${this.baseURL}/user/user`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  addUser(data:any) : Observable<any>{
    const url = `${this.baseURL}/user/user`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  addUserBulk(data:any) : Observable<any>{
    const url = `${this.baseURL}/user/user-bulk`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  updateUser(data:any) : Observable<any>{
    const url = `${this.baseURL}/user/user`;
    return this.http.patch(url,data,this.utils.getHeaders());
  }

  deleteUser(params:any) : Observable<any>{
    const url = `${this.baseURL}/user/user`;
    return this.http.delete(url,{...this.utils.getHeaders(),params});
  }

  downloadSampleUserCSV() : Observable<any>{
    const url = `assets/sampleuser.json`;
    return this.http.get(url);
  }
}
