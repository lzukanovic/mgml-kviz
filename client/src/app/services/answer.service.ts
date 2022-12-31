import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Answer} from "../shared/interfaces";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getAnswers(sectionId: number, questionId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/section/${sectionId}/question/${questionId}/answer`);
  }

  getAnswer(sectionId: number, questionId: number, answerId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/section/${sectionId}/question/${questionId}/answer/${answerId}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
      );
  }

  saveAnswers(sectionId: number, questionId: number, answers: FormData): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/section/${sectionId}/question/${questionId}/answer`,
      answers,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  incrementAnswers(sectionId: number, questionId: number, answerIds: number[]): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/section/${sectionId}/question/${questionId}/answer/count`,
      {answers: answerIds}
    );
  }

  bufferToFile(name: string | undefined | null, type: string, buffer: number[] | Uint8Array): File {
    const blob = new Blob([new Uint8Array(buffer)]);
    return new File([blob], name || 'blob', {type});
  }
}
