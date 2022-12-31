import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Section} from "../shared/interfaces";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../environments/environment";

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
    return this.http.get(
      `${environment.apiUrl}/api/section`,
      {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
        params
      }
    );
  }

  getSection(sectionId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/section/${sectionId}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  createSection(section: Section): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/section`,
      {section},
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  updateSection(section: Section): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/section/${section.id}`,
      {section},
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }

  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/api/section/${sectionId}`,
      { headers: { Authorization: `Bearer ${this.auth.getToken()}` }}
    );
  }
}
