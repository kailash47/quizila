import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  baseURL:string = UtilsService.BASE_URL;
  constructor(private http: HttpClient,public utils:UtilsService) { 
  }

  getQuiz(params?:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  addQuiz(data:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  updateQuiz(data:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz`;
    return this.http.patch(url,data,this.utils.getHeaders());
  }

  deleteQuiz(params:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz`;
    return this.http.delete(url,{...this.utils.getHeaders(),params});
  }

  getCatQuestion(params?:any) : Observable<any>{
    const url = `${this.baseURL}/question/cat-question`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  addQuestionToQuiz(data:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-question-map`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  getQuestionToQuiz(params?:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-question-map`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  deleteQuestionToQuiz(params?:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-question-map`;
    return this.http.delete(url,{...this.utils.getHeaders(),params});
  }

  addUserToQuiz(data:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-user-map`;
    return this.http.post(url,data,this.utils.getHeaders());
  }

  getUserToQuiz(params?:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-user-map`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }
  deleteUserToQuiz(params?:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-user-map`;
    return this.http.delete(url,{...this.utils.getHeaders(),params});
  }

  getMyQuiz(params?:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/my-quiz`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  submitQuiz(data:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-question-user-map`;
    return this.http.post(url,data,{...this.utils.getHeaders()});
  }

  getLeaderboard(params?:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/leaderboard`;
    return this.http.get(url,{...this.utils.getHeaders(),params});
  }

  startQuiz(data:any) : Observable<any>{
    const url = `${this.baseURL}/quiz/quiz-user-map`;
    return this.http.patch(url,data,{...this.utils.getHeaders()});
  }
}
