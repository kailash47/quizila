import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  baseURL:string = UtilsService.BASE_URL;
  constructor(private http: HttpClient,public utils:UtilsService) { 
  }

  getCategory(params?:any) : Observable<any>{
    const url = `${this.baseURL}/cat/qcategory`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  addCategory(data:any) : Observable<any>{
    const url = `${this.baseURL}/cat/qcategory`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  updateCategory(data:any) : Observable<any>{
    const url = `${this.baseURL}/cat/qcategory`;
    return this.http.patch(url,data,this.utils.getHeaders());
  }

  deleteCategory(params:any) : Observable<any>{
    const url = `${this.baseURL}/cat/qcategory`;
    return this.http.delete(url,{...this.utils.getHeaders(),params});
  }

  getQuestion(params?:any) : Observable<any>{
    const url = `${this.baseURL}/question/question`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  addQuestion(data:any) : Observable<any>{
    const url = `${this.baseURL}/question/question`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  updateQuestion(data:any) : Observable<any>{
    const url = `${this.baseURL}/question/question`;
    return this.http.patch(url,data,this.utils.getHeaders());
  }

  deleteQuestion(params:any) : Observable<any>{
    const url = `${this.baseURL}/question/question`;
    return this.http.delete(url,{...this.utils.getHeaders(),params});
  }

  getOption(params?:any) : Observable<any>{
    const url = `${this.baseURL}/question/option`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  addOption(data:any) : Observable<any>{
    const url = `${this.baseURL}/question/option`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  updateOption(data:any) : Observable<any>{
    const url = `${this.baseURL}/question/option`;
    return this.http.patch(url,data,this.utils.getHeaders());
  }

  deleteOption(params:any) : Observable<any>{
    const url = `${this.baseURL}/question/option`;
    return this.http.delete(url,{...this.utils.getHeaders(),params});
  }

  

  
}
