import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Question} from "../shared/interfaces";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getQuestions(sectionId: number, sortParams?: string[]): Observable<any> {
    let params;
    if (sortParams && sortParams.length == 2) {
      params = new HttpParams().set('sort', sortParams[0] + ':' + sortParams[1]);
    }
    return this.http.get(
      `/api/section/${sectionId}/question`,
      {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
        params
      }
    );
  }

  getQuestion(sectionId: number, questionId: number): Observable<any> {
    return this.http.get(`/api/section/${sectionId}/question/${questionId}`);
  }

  createQuestion(sectionId: number, question: Question): Observable<any> {
    return this.http.post(
      `/api/section/${sectionId}/question`,
      {question},
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  updateQuestion(sectionId: number, question: Question): Observable<any> {
    return this.http.put(
      `/api/section/${sectionId}/question/${question.id}`,
      {question},
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  deleteQuestion(sectionId: number, questionId: number): Observable<any> {
    return this.http.delete(
      `/api/section/${sectionId}/question/${questionId}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }
}
