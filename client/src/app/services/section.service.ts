import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Section} from "../shared/interfaces";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getSections(sortParams?: string[]): Observable<any> {
    let params;
    if (sortParams && sortParams.length == 2) {
      params = new HttpParams().set('sort', sortParams[0] + ':' + sortParams[1]);
    }
    return this.http.get('/api/section', {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      params
    });
  }

  getSection(sectionId: number): Observable<any> {
    return this.http.get(
      `/api/section/${sectionId}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  createSection(section: Section): Observable<any> {
    return this.http.post(
      '/api/section',
      {section},
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  updateSection(section: Section): Observable<any> {
    return this.http.put(
      `/api/section/${section.id}`,
      {section},
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete(
      `/api/section/${sectionId}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }
}
